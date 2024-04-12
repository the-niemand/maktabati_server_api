const cron = require('node-cron');
const ReservationsModel = require('../models/Reservations');


cron.schedule('0 0 * * *', async () => {
     try {

          const expiredReservations = await ReservationsModel.find({
               pickupDate: { $lt: new Date() },
               status: 'reserved'
          });


          for (const reservation of expiredReservations) {
               reservation.status = 'expired';
               await reservation.save();
          }

     } catch (error) {
          console.error('Error processing expired reservations:', error);
     }
});
