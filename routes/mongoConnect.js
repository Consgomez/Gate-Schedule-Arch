const mongoose = require('mongoose');
const mongo_uri = require('./../configuration/credentials');

mongoose.connect(mongo_uri.mongoCredentials.mongolink, {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err) throw (err)
    console.log('Successfully connected to Mongo DB');
});