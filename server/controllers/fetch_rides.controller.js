const mongoose = require('mongoose');
const rideService = require('../services/rides.service');
const Ride = require('../models/ride.model');
require('dotenv').config();

async function get_rides(req, res) {
    try {
        //No data required since this functions return
        //random rides to the user on very first login
        const result = await rideService.get_rides();

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
}

async function get_org_rides(req, res) {
    try {
        const result = await rideService.get_org_rides(req.user);
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
}

module.exports = {
    get_rides,
    get_org_rides
};