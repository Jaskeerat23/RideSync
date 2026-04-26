const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./auth.route.js');
const dashboardRoutes = require('./rides.route.js');
const create =require('./ride.route.js');
const cors = require('cors');
dotenv.config();

const app = express();

// Global middlewares 
app.use(cors({
    origin: true, //['http://localhost:5500', // Allow both
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    exposedHeaders: ['set-cookie']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.use('/rides', create);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});