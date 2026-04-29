const rideService = require('../services/rides.service');
const r2 = require('../config/r2');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

//Yash Controller
async function ride_details(req, res) {
    try {
        const rideId = req.params.id;
        console.log(rideId);
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

//Adarsh Controller
async function create_ride(req, res) {
    try {
        const data = req.body;

        data.startLocation = JSON.parse(data.startLocation);
        data.endLocation = JSON.parse(data.endLocation);

        data.userId = req.user._id;

        //Upload to R2
        if (req.file) {
            const fileName = `rides/${Date.now()}-${req.file.originalname}`;

            const command = new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            });

            await r2.send(command);

            data.banner = `${process.env.R2_PUBLIC_URL}/${fileName}`;
        }

        const result = await rideService.createRide(data);

        res.status(201).json({
            success: true,
            data: result
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

//Jaskeerat Controller
async function get_rides(req, res) {
    try {
        //No data required since this functions return
        //random rides to the user on very first login
        const lng = parseFloat(req.query.lng), lat = parseFloat(req.query.lat);
        console.log(lng, " ", lat);
        const result = await rideService.get_rides({lng, lat});
        console.log("result fetched");
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
        console.log("some error occured");
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

async function get_rides_type_based(req, res) {
    try{
        const type = req.query.type, lng = req.query.lng, lat = req.query.lat;
        const result = await rideService.get_rides_type_based(type, {lng, lat});

        if(!result.success) {
            return res.status(400).json({
                success: false,
                message: "No rides found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result
        });
    }
    catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}
async function get_rides_diff_based(req, res) {
    try{
        const diff = req.query.diff, lng = parseFloat(req.query.lng), lat = parseFloat(req.query.lat);
        const result = await rideService.get_rides_diff_based(diff, {lng, lat});

        if(!result.success) {
            return res.status(400).json({
                success: false,
                message: "No rides found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result
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
    ride_details,
    create_ride,
    get_rides,
    get_org_rides,
    get_rides_type_based,
    get_rides_diff_based
};