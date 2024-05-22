const express = require('express');
const router = express.Router();
const UsersModel = require('../models/Users');
const BooksModel = require('../models/Books');
const SavedModel = require('../models/Saved');

router.use(express.json());


router.get('/fetchSavedBooks', async (req, res) => {
     try {
          const reservations = await SavedModel.find({});
          res.json({ data: reservations });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});




// Create reservation
router.post('/createSaved', async (req, res) => {
     try {
          const { userId, bookId } = req.body;
          const user = await UsersModel.findById(userId);
          const book = await BooksModel.findById(bookId);

          if (!user) {
               return res.status(404).json({ error: 'User not found' });
          }

          if (!book) {
               return res.status(404).json({ error: 'Book not found' });
          }

          const Saved = new SavedModel({
               user: userId,
               book: bookId,
          });

          const savedBook = await Saved.save();
          res.status(201).json({ data: savedBook });
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
});

// Delete reservation by ID
router.delete('/deleteSavedById', async (req, res) => {
     try {
          const { user, book } = req.body;
          const deletedSavedBook = await SavedModel.findOneAndDelete({ user, book });

          if (!deletedSavedBook) {
               return res.status(404).json({ error: 'Saved not found' });
          }

          res.json({ data: deletedSavedBook });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});



module.exports = router;