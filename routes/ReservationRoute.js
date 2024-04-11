const express = require('express');
const router = express.Router();
const UsersModel = require('../models/Users');
const BooksModel = require('../models/Books');
const ReservationsModel = require('../models/Reservations');

router.use(express.json());

// Fetch all reservations
router.get('/fetchReservations', async (req, res) => {
     try {
          const reservations = await ReservationsModel.find({});
          res.json({ data: reservations });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

// Fetch reservation by ID
router.get('/fetchReservation/:id', async (req, res) => {
     try {
          const id = req.params.id;
          const reservation = await ReservationsModel.findById(id);

          if (!reservation) {
               return res.status(404).json({ error: 'Reservation not found' });
          }

          res.json({ data: reservation });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

// Create reservation
router.post('/createReservation', async (req, res) => {
     try {
          const { userId, bookId, expectedDeliveryDate } = req.body;

          // Check if the user and book exist
          const user = await UsersModel.findById(userId);
          const book = await BooksModel.findById(bookId);

          if (!user) {
               return res.status(404).json({ error: 'User not found' });
          }

          if (!book) {
               return res.status(404).json({ error: 'Book not found' });
          }

          const reservation = new ReservationsModel({
               user: userId,
               book: bookId,
               pickupDate: new Date(), // Default to current date
               expected_deliveryDate: expectedDeliveryDate,
               status: 'reserved'
          });

          const savedReservation = await reservation.save();
          res.status(201).json({ data: savedReservation });
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
});

// Delete reservation by ID
router.delete('/deleteReservationById/:id', async (req, res) => {
     try {
          const id = req.params.id;
          const deletedReservation = await ReservationsModel.findByIdAndDelete(id);

          if (!deletedReservation) {
               return res.status(404).json({ error: 'Reservation not found' });
          }

          res.json({ data: deletedReservation });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

// Update reservation by ID
router.put('/updateReservationById/:id', async (req, res) => {
     try {
          const id = req.params.id;
          const newData = req.body;

          const updatedReservation = await ReservationsModel.findByIdAndUpdate(
               id,
               newData,
               { new: true }
          );

          if (!updatedReservation) {
               return res.status(404).json({ error: 'Reservation not found' });
          }

          res.json({ data: updatedReservation });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

module.exports = router;
