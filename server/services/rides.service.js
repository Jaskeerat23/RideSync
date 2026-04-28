const mongoose = require('mongoose');
const Ride = require('../models/ride.model');
const user = require('../models/user.model');
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

async function create_ride(data) {
    try {
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
    
        return {
            success: true,
            data: ride
        };
    }
    catch(err) {
        throw err;
    }
}

async function get_org_rides(data) {
    try {
        await connect_to_db();
        const _id = data._id;
        console.log("Inside ride fetcher, ", _id);

        const result = await Ride.find(
            { userId: new mongoose.Types.ObjectId(_id) },
            { _id: 1, title: 1, banner: 1, difficulty: 1, type: 1}
        );

        console.log(result);

        return {
            success: true,
            data: result
        };
    }
    catch(err) {
        throw err;
    }
}

async function get_rides(user_cords) {
    try {
        await connect_to_db();
        
        const res = await Ride.aggregate([
            { $geoNear: {
                near: {
                    type: 'Point', coordinates: [ user_cords.lng, user_cords.lat ]
                },
                query: {
                    type: type, status: 'Upcoming'
                },
                distanceField: "dist.calculated",
                spherical: true
            } },
            { $limit: 20 },
            { $project : { _id: 1, title: 1, banner: 1, difficulty: 1, type: 1} }
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

async function get_rides_type_based(type, user_cords) {
    try{
        const res = await Ride.aggregate([
            { $geoNear: {
                near: {
                    type: 'Point', coordinates: [ user_cords.lng, user_cords.lat ]
                },
                query: {
                    type: type, status: 'Upcoming'
                },
                distanceField: "dist.calculated",
                spherical: true
            } },
            { $limit: 20 },
            { $project : { _id: 1, title: 1, banner: 1, difficulty: 1, type: 1} },
            { $sort: { startDate: 1 } }
        ]);

        if(res.length == 0) {
            return {
                success: false,
                message: 'No rides available'
            };
        }

        return {
            success: true,
            data: res
        };
    }
    catch(err) {
        throw err;
    }
}

async function get_rides_diff_based(diff, user_cords) {
    try{
        const res = await Ride.aggregate([
            { $geoNear: {
                near: {
                    type: 'Point', coordinates: [ user_cords.lng, user_cords.lat ]
                },
                query: {
                    difficulty: diff, status: 'Upcoming'
                },
                distanceField: "dist.calculated",
                spherical: true
            } },
            { $limit: 20 },
            { $project : { _id: 1, title: 1, banner: 1, difficulty: 1, type: 1} },
            { $sort: { startDate: 1 } }
        ]);

        if(res.length == 0) {
            return {
                success: false,
                message: 'No rides available'
            };
        }

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
    create_ride,
    get_org_rides,
    get_rides,
    get_rides_type_based,
    get_rides_diff_based
};