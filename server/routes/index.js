const express = require('express');
const dotenv = require('dotenv');

const authRoutes = require('./auth.js'); // 👈 THIS is your auth.js

dotenv.config();

const app = express();

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 👇 Mount auth routes
app.use('/auth', authRoutes);

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});