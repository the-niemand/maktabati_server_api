const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    Fullname: { type: String, required: true },
    email: { type: String, required: true ,unique: true},
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    role: { type: String, default: 'member' },
})

const UsersModel = mongoose.model("Users", UsersSchema)
module.exports = UsersModel;


