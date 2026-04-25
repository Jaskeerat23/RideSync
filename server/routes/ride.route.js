const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const rideController = require('../controllers/ride.controller');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Open to all three roles (rider / organizer / sponsor).
// authorizeRole only accepts a single role string today, so we let
// the service decide what flags to return based on req.user.role
// instead of gating with authorizeRole here.
router.get('/ride_details/:id', authMiddleware.authMiddleware, rideController.ride_details);

module.exports = router;
