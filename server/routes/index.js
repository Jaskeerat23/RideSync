const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./auth.route.js');
const rideRoutes = require('./rides.route.js');
const dashboard = require('./analytical_dashboard.route.js');
const cors = require('cors');
const rider = require('../models/rider.model.js');
dotenv.config();

const app = express();

// Global middlewares 
app.use(cors({
    origin: 'https://ride-sync-psi.vercel.app', // EXACT frontend origin
    credentials: true                // allow cookies
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/rides', rideRoutes);
app.use('/dashboard', dashboard);

app.listen(process.env.PORT, () => {
    console.log("Server running on port 3000");
});