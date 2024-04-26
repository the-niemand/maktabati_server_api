const express = require('express');
const router = express.Router();
const BooksModel = require('../models/Books');
const multer = require("multer")

router.use(express.json());

//multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
    },
});


const upload = multer({ storage })




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




router.post('/createBook', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const data = JSON.parse(req.body.data);

        const book = new BooksModel(data);
        const savedBook = await book.save();

        res.status(201).json({ data: savedBook });
    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed' });
        }
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
