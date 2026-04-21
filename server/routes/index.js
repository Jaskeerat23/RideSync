const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./auth.route.js');
const dashboardRoutes = require('./dashboard.js');
const cors = require('cors');
dotenv.config();

const app = express();

// Global middlewares 
app.use(cors({
    origin: 'http://localhost:5500', // EXACT frontend origin
    credentials: true                // allow cookies
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});