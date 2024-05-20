const express = require('express');
const router = express.Router();
const BooksModel = require('../models/Books');
const multer = require("multer")
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const { Console } = require('console');
router.use(express.json());


//multer


const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
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

router.post('/fetchFilteredBooks', async (req, res) => {
    try {
        const data = req.body
        const query = {};
        const sort = {};

        if (data.searchValue) {
            query.title =  { "$regex": data.searchValue, "$options": "i" }  ;
        }
        if (data.category) {
            query.categories = { $elemMatch: { $eq: data.category } };
        }
        if (data.type) {
            query.type = data.type;
        }


        if (data.sortBy === "release") {
            sort.createdDate = 1;
        } else if (data.sortBy === "copies") {
            sort.copies = 1;
        }

        const books = await BooksModel.find(query).sort(sort);
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

        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.url;

        const data = JSON.parse(req.body.data);
        data.image = image;

        const book = new BooksModel(data);
        const savedBook = await book.save();

        res.status(201).json({ data: savedBook });
    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed' });
        }
        return res.status(500).json({ error: err.message });
    }
});



// router.post('/createBook', upload.single('file'), async (req, res) => {
//     cloudinary.uploader.upload(req.file.path, async (err, res) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         // try {
//         //     if (!req.file) {
//         //         return res.status(400).json({ error: 'No image uploaded' });
//         //     }

//         //     const data = JSON.parse(req.body.data);
//         //     const book = new BooksModel(data);
//         //     const savedBook = await book.save();
//         //     res.status(201).json({ data: savedBook });

//         // } catch (err) {
//         //     if (err instanceof multer.MulterError) {
//         //         return res.status(500).json({ error: 'Image upload failed' });
//         //     }
//         //     res.status(500).json({ error: err.message });
//         // }
//         return res.status(200).json({ data: res });
//     })



// });












router.delete('/deleteBookById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const book = await BooksModel.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (book.image) {
            const imagePath = path.join(__dirname, '../images', book.image);
            console.log(imagePath);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            } else {
                console.log('Image does not exist:', imagePath);
            }
        }

        res.json({ message: 'Book deleted successfully' });
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
