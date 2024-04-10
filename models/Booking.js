const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
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
  booking_date: {
    type: Date,
    default: Date.now
  },
  expected_delivery: {
    type: Date,
    default: null
  },
  actual_delivery: {
    type: Date,
    default: null
  }
});

const BookingModel = mongoose.model("Booking", BookingSchema);
module.exports = BookingModel;
