const express = require('express');
let nodemailer = require("nodemailer");
let verify = require('./../middleware/verifyAccess');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const Reservation = require('./../models/reservations');
const User = require('./../models/user');
const Admin = require('./../models/admin');

const router = express();

let currentUser = null;

router.get('/', verify, async(req, res) => {
    let reservations = await Reservation.find({user_id: currentUser});

    res.render('index', {reservations});
})

router.get('/admin', verify, async(req, res) => {
    let reservations = await Reservation.find()
    
    res.render('admin', {reservations});
})

router.get('/login', async(req, res) => {
    res.render('login');
})

router.post('/login', async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    currentUser = email;

    if(!user) {
        console.log("No hay usuario")
    }

    try{
        await bcrypt.compareSync(password, user.password)

        const token = jwt.sign({user_id: user.email}, process.env.SECRET, {expiresIn:"2h"})
        res.cookie("token", token, {httpOnly:true})
        res.redirect('/');
    } catch(err) {
        res.redirect('/login')
    }
})

router.get('/register', async(req, res) => {
    res.render('register')
})

router.post('/register', async(req, res) => {
    const { email, password } = req.body;

    const user = await Admin.findOne({email});

    if(!user) {
        console.log("No hay usuario")
    }

    try{
        await bcrypt.compareSync(password, user.password)

        const token = jwt.sign({user_id: user.email}, process.env.SECRET, {expiresIn:"1h"})
        res.cookie("token", token, {httpOnly:true})
        res.redirect('/admin');
    } catch(err) {
        res.redirect('/register')
    }
})

router.post('/reservation', verify, async(req, res) => {
    try{
        let puerta = req.body.puerta
        let fechaR = req.body.fechaRes
        let tiempo = req.body.tiempo
        let aerolinea = req.body.aeroName
        console.log(req.body.userId)
        //get the date
        let fecha = new Date()
        fecha = fecha.toDateString()
        //check existance
        let reservations = await Reservation.find({date: fechaR, gate: puerta})
        if(reservations.length == 0)
        {
            let reserva = new Reservation({date: fechaR, gate: puerta, hour: tiempo, aerolinea: aerolinea, reservation:fecha, user_id: currentUser})
            await reserva.save()
            res.redirect('/')
        } else {
            for(let i=0; i<reservations.length; i++){
                if(reservations[i].gate != puerta && reservations[i].hour != tiempo){
                    //create & save
                    let reserva = new Reservation({date: fechaR, gate: puerta, hour: tiempo, aerolinea: aerolinea, reservation:fecha, user_id: currentUser})
                    await reserva.save()
                    res.redirect('/')
                }
                else {
                    res.sendStatus(500);
                    return;
                }
            }
        }
    } catch(err){
        console.log(err)
    }
})

router.post('/status/:id/:gate/:date/:hour/:aero', verify, async(req, res) => {
    let gate = req.params.gate
    try{
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'hugh.greenfelder84@ethereal.email',
                pass: 'dv4YuBB15wS6YGgXee'
            }
        });
        let mailOptions = {
            from: "Remitente",
            to: "hugh.greenfelder84@ethereal.email",
            subject: "Confirmaci??n de reserva",
            text: "Tu reserva a sido confirmada. Tu reserva para la puerta "+gate+" del d??a "+req.params.date+" a las "+req.params.hour+" horas, con la aerol??nea "+req.params.aero+" ha sido confirmada",
            html: "<h1>Tu reserva a sido confirmada</h1> <p>Tu reserva para la puerta "+gate+" del d??a "+req.params.date+" a las "+req.params.hour+" horas, con la aerol??nea "+req.params.aero+" ha sido confirmada</p>"
        }

        transporter.sendMail(mailOptions, async(err, info) => {
            if(err){
                res.status(500).send(err.message);
            }else{
                console.log("Email enviado")
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                await Reservation.updateOne({_id: req.params.id}, {status: 'Accepted'})
                res.redirect('/admin')
            }
        })
    } catch(err){
        console.log(err)
    }
})

module.exports = router;
