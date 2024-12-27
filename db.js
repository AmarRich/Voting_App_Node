const mongoose = require('mongoose')
require('dotenv').config()

const mongoURL = process.env.MONGODB_URL_LOCAL
// const mongoURL = process.env.MONGODB_URL

mongoose.connect(mongoURL,{
    // below was removed for warning
    // useNewUrlParser:true,
    // useUnifiedTopology: true
})

const db = mongoose.connection

db.on('connected',()=>{
    console.log('connected to mongodb server');
})
db.on('error',(err)=>{
    console.log('error in mongodb server',err);
})
db.on('disconnected',()=>{
    console.log('disconnected to mongodb server');
})

module.exports = db
