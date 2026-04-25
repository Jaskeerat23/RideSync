const rideService = require('../services/ride.service');
require('dotenv').config();

async function ride_details(req, res) {
    try {
        const rideId = req.params.id;
        const result = await rideService.ride_details(rideId, req.user);

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
    ride_details
};
