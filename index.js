const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
let cookieParser = require('cookie-parser');

const mongodb = require('./routes/mongoConnect');

dotenv.config();

const app = express();

//import routes
const indexRoutes = require('./routes/routeIndex');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'assets')));

app.use('/', indexRoutes);

app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
})