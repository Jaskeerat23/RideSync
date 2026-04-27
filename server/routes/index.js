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
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],  // Both!
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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