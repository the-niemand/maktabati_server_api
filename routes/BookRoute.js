const express = require('express');
const router = express.Router();
const BooksModel = require('../models/Books');

// Connect to database (if not already handled in BooksModel)

router.use(express.json());

router.get('/fetchBooks', async (req, res) => {
    try {
        const books = await BooksModel.find({});
        res.json({ data: books });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/fetchBook/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const book = await BooksModel.findById(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ data: book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
















router.post('/createBook', async (req, res) => {
    try {
        const data = req.body;
        const book = new BooksModel(data);
        const savedBook = await book.save();
        res.status(201).json({ data: savedBook });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

















router.delete('/deleteBookById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBook = await BooksModel.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({ data: deletedBook });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/updateBooksById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;

        const updatedBook = await BooksModel.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({ data: updatedBook });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
