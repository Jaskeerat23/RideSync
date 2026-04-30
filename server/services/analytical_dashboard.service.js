const mongoose = require('mongoose');
require('dotenv').config();

const Ride = require('../models/ride.model');

async function connect_to_db() {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URI_JAS);
        console.log("Connection Successful, fetch_rides");
    }
    catch(err) {
        throw err;
    }
}

// _id is org id
async function get_basic_analysis(_id) {
    try {

        await connect_to_db();

        const res = await Ride.find(
            { userId: new mongoose.Types.ObjectId(_id) }
        );

        const ridesCreated = res.length;

        if(ridesCreated == 0) {
            return {
                success: false,
                message: "No Rides from this user"
            };
        }

        let totalBookingsDone = 0, revenueGenerated = 0;

        for(let i = 0; i < ridesCreated; i++) {
            totalBookingsDone += res[i].bookedSeats;
            revenueGenerated += res[i].bookedSeats * res[i].entryFee;
        }

        return {
            success: true,
            data : {
                ridesCreated: ridesCreated,
                totalBookingsDone: totalBookingsDone,
                revenueGenerated: revenueGenerated
            }
        };
    }
    catch(err) {
        throw err;
    }
}

async function get_successful_rides(_id) {
    try {

        await connect_to_db();

        const res = await Ride.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(_id) } },
            {
                $addFields: {
                    occupancyRate: {
                        $cond: [
                            { $eq: [ "$maxSeats", 0] },
                            0,
                            { $divide: [ "$bookedSeats", "$maxSeats" ] }
                        ]
                    }
                }
            },
            { $sort: { occupancyRate: -1 } },
            { $project: {
                _id: 1,
                title: 1,
                bookedSeats: 1,
                entryFee: 1,
                startAddress: 1,
                endAddress: 1
            } }
        ]);

        console.log(res);

        return {
            success: true,
            data: res
        };
    }
    catch(err) {
        throw err;
    }
}

module.exports = {
    get_basic_analysis,
    get_successful_rides
};

