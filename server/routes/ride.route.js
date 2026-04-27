const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const rideController = require('../controllers/ride.controller');
const multer = require('multer');

const router = express.Router();

// 🔥 MEMORY STORAGE (important for R2)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
    '/create',
    authMiddleware.authMiddleware,
    authMiddleware.authorizeRole('organizer'),  // ⚠️ MISSING!
    upload.single('banner'),
    rideController.createRide
);

module.exports = router;