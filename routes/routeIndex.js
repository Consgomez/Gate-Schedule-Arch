const express = require('express');
let verify = require('./../middleware/verifyAccess');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const Reservation = require('./../models/reservations');
const User = require('./../models/user');
const Admin = require('./../models/admin');

const router = express();

router.get('/', verify, async(req, res) => {
    res.render('index');
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

        const token = jwt.sign({user_id: user.email}, process.env.SECRET, {expiresIn:"2h"})
        res.cookie("token", token, {httpOnly:true})
        res.redirect('/admin');
    } catch(err) {
        res.redirect('/register')
    }
})

router.post('/reservation', async(req, res) => {
    try{
        let puerta = req.body.puerta
        let fechaR = req.body.fechaRes
        let tiempo = req.body.tiempo
        let aerolinea = req.body.aeroName
        //check existance
        let reservations = await Reservation.find({date: fechaR})
        //console.log(reservations[gate])
        // if(reservations.gate == puerta && reservations.hour == tiempo){
        //     console.log("BTS")
        // }
        //get the date
        let fecha = new Date()
        fecha = fecha.toDateString()
        //create & save
        let reserva = new Reservation({date: fechaR, gate: puerta, hour: tiempo, aerolinea: aerolinea, reservation:fecha})
        await reserva.save()
        res.redirect('/')
    } catch(err){
        console.log(err)
    }
})

module.exports = router;
