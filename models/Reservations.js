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
          default: () => new Date(Date.now()),
          required: true
     },
     expected_deliveryDate: {
          type: Date,
          required: true,
          validate: {
               validator: function (value) {
                    return value > this.pickupDate; 
               },
               message: 'Expected delivery date must be after pickup date'
          }
     },
     actual_deliveryDate: {
          type: Date,
          default: null
     },
     status: {
          type: String,
          enum: ['reserved', 'expired', 'borrowed' , 'returned' , 'unreturned'],
          default: 'reserved'
     }
});


const ReservationsModel = mongoose.model("Reservations", ReservationSchema);
module.exports = ReservationsModel;
