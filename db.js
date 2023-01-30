const mongoose = require ("mongoose");

var mongoURL = 'mongodb+srv://awaisnaseer001:43564770@atlascluster.hhzi1hy.mongodb.net/test';

mongoose.connect(mongoURL, {useUnifiedTopology: true, useNewUrlParser:true})

var connection = mongoose.connection

connection.on('error' , ()=>{
    console.log ('Mongo DB connection failed')
})

connection.on('connected' , ()=>{
    console.log ('Mongo DB connection successfull')
})


module.exports = mongoose