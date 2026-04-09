const mongoose = require('mongoose');
const Ride = require('../models/ride.model');
require('dotenv').config();

async function connect_to_db() {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URI_JAS);
        console.log("Connection Successful, fetch_rides");
    }
    catch(err) {
        throw err;
    }
}

async function get_org_rides(data) {
    try {
        const _id = data._id;

        const result = await Ride.find({
            userId: new mongoose.Schema.Types.ObjectId(_id)
        });

        return {
            success: true,
            data: result
        };
    }
    catch(err) {
        throw err;
    }
}

async function get_rides() {
    try {
        await connect_to_db();
        
        const res = await Ride.aggregate([
            { $sample: { size: 10} }
        ]);

        if(res.length === 0) {
            return {
                success: false,
                message: "No Rides available"
            };
        }
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
    get_org_rides,
    get_rides
};