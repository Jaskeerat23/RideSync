const mongoose = require('mongoose');
const Ride = require("../models/ride.model");
require('dotenv').config();

async function connect_to_db() {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URI_ADARSH);
}

exports.createRide = async (data, user) => {

    await connect_to_db();

    if (!user || !user._id) {
        throw new Error("Unauthorized user");
    }

    const {
        startLocation,
        endLocation,
        title,
        startDate,
        endDate,
        time,
        maxSeats
    } = data;

    // Validation
    if (!startLocation || !endLocation) {
        throw new Error("Locations are required");
    }

    if (!startLocation.lat || !startLocation.lng) {
        throw new Error("Invalid start location");
    }

    if (!endLocation.lat || !endLocation.lng) {
        throw new Error("Invalid end location");
    }

    const ride = await Ride.create({
        ...data,

        // Use _id from JWT
        userId: new mongoose.Types.ObjectId(user._id),

        startLocation: {
            type: "Point",
            coordinates: [startLocation.lng, startLocation.lat]
        },

        endLocation: {
            type: "Point",
            coordinates: [endLocation.lng, endLocation.lat]
        }
    });

    return ride;
};