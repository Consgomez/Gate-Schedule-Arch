const express = require('express');
let verify = require('./../middleware/verifyAccess');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

//modelo de reservación

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

module.exports = router;
