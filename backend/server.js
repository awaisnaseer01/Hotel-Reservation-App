const express = require ("express");

const app = express();

const dbconfig = require('./db')

const roomRoute =require ('./routes/roomRoute')

app.use('/api/rooms', roomRoute)


const port =process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log("Listening to port 5000")
  });