const express = require('express');
const app = express();
app.use(express.json());
require('./config/connect');
require('dotenv').config()


const UserRoute = require('./routes/UserRoute');
app.use('/users', UserRoute);



app.listen(process.env.PORT, () => {
     console.log(`server runs succesfuly on ${process.env.PORT}`);
});
