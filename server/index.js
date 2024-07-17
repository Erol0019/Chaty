const express = require('express');

const mongoose = require('mongoose');   

const app = express();
require('dotenv').config();


app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}). then(() => {
    console.log('connected to mongodb');
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
    console.log('server is running on port', process.env.PORT);
});
