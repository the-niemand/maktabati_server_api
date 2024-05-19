const cloudinary = require('cloudinary').v2

cloudinary.config({ 
     cloud_name: "dd3h4c0x1", 
     api_key: "176651967856333", 
     api_secret: "kFpM0xwoyJwSE7ZV8Lhz1GuJ67M" // Click 'View Credentials' below to copy your API secret
 });

 module.exports = cloudinary;