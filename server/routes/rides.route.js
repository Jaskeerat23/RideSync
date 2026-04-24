const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const rideController = require('../controllers/fetch_rides.controller');

router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/rider_rides', authMiddleware.authMiddleware, authMiddleware.authorizeRole('rider'), rideController.get_rides);
router.get('/org_rides', authMiddleware.authMiddleware, authMiddleware.authorizeRole('organizer'), rideController.get_org_rides);

module.exports = router;