const mongoose = require('mongoose')

const BooksSchema = new mongoose.Schema({
     title: { type: String, required: true },
     authors: { type: [String], required: true },
     type: { type: String, required: true },
     categories: { type: [String], required: true, default: ['unknown'] },
     copies: { type: Number, required: true, min: 1 },
     image: { type: String },
     status:{type: String},
     createdDate: { type: Date, default: Date.now }
});

BooksSchema.index({ title: 'text' });
const BooksModel = mongoose.model("Books", BooksSchema)
module.exports = BooksModel;


