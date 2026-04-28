const rideService = require('../services/ride.service');
const r2 = require('../config/r2');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

exports.createRide = async (req, res) => {
    try {
        const data = req.body;

        data.startLocation = JSON.parse(data.startLocation);
        data.endLocation = JSON.parse(data.endLocation);

        data.userId = req.user._id;

        // 🔥 Upload to R2
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
};