const express = require('express');
let verify = require('./../middleware/verifyAccess');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

const Reservation = require('./../models/reservations');

const router = express();

router.get('/', verify, async(req, res) => {
    res.render('index');
})

router.get('/admin', verify, async(req, res) => {
    res.render('admin');
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

        const token = jwt.sign({user_id: user.email}, process.env.SECRET, {expiresIn:"1h"})
        res.cookie("token", token, {httpOnly:true})
        res.redirect('/')
    } catch(err) {
        res.redirect('/login')
    }
})

router.get('/register', async(req, res) => {
    res.render('register')
})

router.post('/register', async(req, res) => {
    const { email, password } = req.body;

    try{
        const user = new User({email, password});
        await user.save();

        const token = jwt.sign({user_id: user.email}, process.env.SECRET, {expiresIn:"1h"});
        res.redirect('/login')
    } catch(err){
        console.log(err);
    }
})

module.exports = router;
