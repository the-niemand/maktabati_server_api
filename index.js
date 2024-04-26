const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


dotenv.config();

app.use(express.static(path.join(__dirname , 'images')))
app.use(express.json());
app.use(cors())


require('./config/connect');
require('./Scheduled Tasks/scheduledTasks');

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

