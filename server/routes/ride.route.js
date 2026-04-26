const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const rideController = require('../controllers/ride.controller');

const router = express.Router();
console.log("ride.route.js is loaded");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post(
    '/create',
    authMiddleware.authMiddleware,
    authMiddleware.authorizeRole('organizer'),
    rideController.createRide
);

module.exports = router;