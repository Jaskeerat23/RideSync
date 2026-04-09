const express = require('express');
const dotenv = require('dotenv');

const authRoutes = require('./auth.js');

dotenv.config();

const app = express();

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});