const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const dashboard_controller = require('../controllers/analytical_dashboard.controller');

const router = express.Router();

router.get('/get_basic_analysis', authMiddleware.authMiddleware, authMiddleware.authorizeRole('organizer'), dashboard_controller.get_basic_analysis);
router.get('/get_successful_rides', authMiddleware.authMiddleware, authMiddleware.authorizeRole('organizer'), dashboard_controller.get_successful_rides);

module.exports = router;