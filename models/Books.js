const mongoose = require('mongoose')

const BooksSchema = new mongoose.Schema({
     title: { type: String, required: true },
     authors: { type: [String], required: true },
     type: { type: String, required: true},
     categories: { type: [String], required: true , default: 'unknow'},
     quantity: { type: Number, required: true },
})

const BooksModel = mongoose.model("Books", BooksSchema)
module.exports = BooksModel;


