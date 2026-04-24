const express = require('express');
const {get_org_rides, get_rides} = require('../controllers/fetch_rides.controller');
const {authMiddleware, authorizeRole} = require('./auth.middleware');

const router = express.Router();

router.get('/rider_rides', authMiddleware, authorizeRole('rider'), async function(req, res) {
    try {
        //No data required since this functions return
        //random rides to the user on very first login
        const result = await get_rides();

        if(!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        res.status(200).json({
            success: true,
            data: result.data
        });
    }
    catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

router.get('/org_rides', authMiddleware, authorizeRole('organizer'), async function(req, res) {
    try {
        const result = await get_org_rides(req.user);
        if(!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        res.status(200).json({
            success: true,
            data: result.data
        });
    }
    catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;