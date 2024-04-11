const express = require('express');
const app = express();
const dotenv = require('dotenv');


dotenv.config();


app.use(express.json());


require('./config/connect'); 

const UserRoute = require('./routes/UserRoute');
const BookRoute = require('./routes/BookRoute');
const ReservationRoute = require('./routes/ReservationRoute');


app.use('/users', UserRoute);
app.use('/books', BookRoute);
app.use('/reservations', ReservationRoute);


const PORT = process.env.PORT; 
app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});
