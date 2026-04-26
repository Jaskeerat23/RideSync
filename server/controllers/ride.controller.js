const rideService = require("../services/ride.service");

exports.createRide = async (req, res) => {
    try {
        const ride = await rideService.createRide(req.body, req.user);

        res.status(201).json({
            success: true,
            data: ride
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};