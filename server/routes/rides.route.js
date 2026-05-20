const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const rideController = require('../controllers/ride.controller');
const multer = require('multer');

const upload = multer();

router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/rider_rides', authMiddleware.authMiddleware, authMiddleware.authorizeRole('rider'), rideController.get_rides);
router.get('/ride_difficulty', authMiddleware.authMiddleware, authMiddleware.authorizeRole('rider'), rideController.get_rides_diff_based)
router.get('/ride_type', authMiddleware.authMiddleware, authMiddleware.authorizeRole('rider'), rideController.get_rides_type_based)
router.get('/org_rides', authMiddleware.authMiddleware, authMiddleware.authorizeRole('organizer'), rideController.get_org_rides);
router.post('/create_ride', upload.single('banner'), authMiddleware.authMiddleware, authMiddleware.authorizeRole('organizer'), rideController.create_ride); // ADARSH
router.get('/ride_details/:id', authMiddleware.authMiddleware, rideController.ride_details); // YASH
module.exports = router;