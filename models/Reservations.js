const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
     user: {
          type: Schema.Types.ObjectId,
          ref: 'Users',
          required: true
     },
     book: {
          type: Schema.Types.ObjectId,
          ref: 'Books',
          required: true
     },
     pickupDate: {
          type: Date,
          default: Date.now,
          required: true
     },
     expected_deliveryDate: {
          type: Date,
          required: true
     },
     actual_deliveryDate: {
          type: Date,
          default: null
     },
     status: {
          type: String,
          enum: ['reserved', 'expired', 'borrowed'],
          default: 'reserved'
     }
});

const ReservationsModel = mongoose.model("Reservations", ReservationSchema);
module.exports = ReservationsModel;
