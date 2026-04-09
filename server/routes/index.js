const express = require('express');
const dotenv = require('dotenv');

const authRoutes = require('./auth.js');
const dashboardRoutes = require('./dashboard.js');
const cors = require('cors');
dotenv.config();

const app = express();

// Global middlewares
app.use(cors({
    origin: 'http://127.0.0.1:5500', // EXACT frontend origin
    credentials: true                // allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});