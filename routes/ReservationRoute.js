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
          const { userId, bookId, copy  , pickupDate , expectedDeliveryDate} = req.body;

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
               copy: copy,
               pickupDate: pickupDate || new Date(),
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


router.get('/unavailability/:id/:copy', async (req, res) => {
     const { id, copy } = req.params;
 
     try {
         // Validate and find the book by ID
         const book = await BooksModel.findById(id);
         if (!book) {
             return res.status(404).json({ message: 'Book not found' });
         }
 
         // Parse 'copy' parameter to ensure it's a number
         const copyNumber = Number(copy);
         if (isNaN(copyNumber)) {
             return res.status(400).json({ message: 'Invalid copy number' });
         }
 
         // Find reservations for the specified book copy that are currently active
         const reservations = await ReservationsModel.find({
             book: id,
             status: { $in: ['reserved', 'borrowed'] },
             copy: copyNumber,
             expected_deliveryDate: { $gte: new Date() },
         }).sort({ pickupDate: 1 });
 
         // Prepare an array of reservation periods
         const periods = reservations.map(reservation => ({
             from: reservation.pickupDate.toISOString().split('T')[0],
             to: reservation.expected_deliveryDate.toISOString().split('T')[0]
         }));
 
         // Return the list of reservation periods
         res.json(periods);
 
     } catch (error) {
         // Handle errors
         return res.status(500).json({ message: error.message });
     }
 });
 


module.exports = router;
