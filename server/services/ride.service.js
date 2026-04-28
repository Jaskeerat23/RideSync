const mongoose = require('mongoose');
const Ride = require('../models/ride.model');
require('dotenv').config();

async function connect_to_db() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI_ADARSH);
        console.log("DB Connected (ride.service)");
    }
}

exports.createRide = async (data) => {

    await connect_to_db();

    const ride = await Ride.create({
        ...data,

        banner: data.banner,

        startLocation: {
            type: "Point",
            coordinates: [data.startLocation.lng, data.startLocation.lat]
        },

        endLocation: {
            type: "Point",
            coordinates: [data.endLocation.lng, data.endLocation.lat]
        }
    });

    return ride;
};