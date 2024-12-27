const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect("mongodb+srv://zakaria:zakaria2004@maktabati.wkbkgdu.mongodb.net/?retryWrites=true&w=majority&appName=maktabati").then(()=>{
     console.log('connected')
}).catch((err)=>{
     console.log(err);
})


module.exports = mongoose
