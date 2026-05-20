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

//Yash Code

async function ride_details(rideId, user) {
    try {
        await connect_to_db();

        console.log("inside ride_details");

        if(!mongoose.Types.ObjectId.isValid(rideId)) {
            return {
                success: false,
                message: "Invalid ride id"
            };
        }

        const ride = await Ride.findById(rideId);
        console.log("ride res, ", ride);
        if(!ride) {
            return {
                success: false,
                message: "Ride not found"
            };
        }
        const response = { ride: ride };
        console.log("building output");
        // ---------- RIDER ----------
        if(user.role === 'rider') {
            // const rider = await Rider.findOne({
            //     userId: new mongoose.Types.ObjectId(user._id)
            // });

            let canBook;
            if(ride.bookedSeats >= ride.maxSeats) {
                // Ride is full
                canBook = false;
            }
            else if(ride.crossBike === false) {
                // Brand-locked ride: rider must own the matching bike
                if(rider && Array.isArray(rider.bikes) && rider.bikes.includes(ride.brand)) {
                    canBook = true;
                }
                else {
                    canBook = false;
                }
            }
            else {
                // Cross-bike allowed (or field not set) and seats available
                canBook = true;
            }

            response.canBook = canBook;
        }

        // ---------- ORGANIZER ----------
        else if(user.role === 'organizer') {
            // The existing code in get_org_rides filters Ride by userId == user._id,
            // so ride.userId stores the User _id (matching that pattern here).
            let canEdit = false;
            if(ride.userId && ride.userId.toString() === user._id.toString()) {
                canEdit = true;
            }
            response.canEdit = canEdit;
        }

        // ---------- SPONSOR ----------
        else if(user.role === 'sponsor') {
            response.canContactForSponsor = true;
        }
        console.log("builded output");
        return {
            success: true,
            data: response
        };
    }
    catch(err) {
        throw err;
    }
}

//Adarsh Code

async function create_ride(data) {
    try {
        await connect_to_db();

        const title = data.title, entryFee = parseFloat(data.entryFee), startDate = data.startDate, endDate = data.endDate;
        const communicationLink = data.communicationLink, startAddress = data.startAddress, endAddress = data.endAddress;
        const communicationType = data.communicationType, maxSeats = data.maxSeats, length = data.length, time = data.time;
        const difficulty = data.difficulty;
        const type = data.type;
        const ride = await Ride.create({
            userId: data.userId,
            title: title,
            entryFee: entryFee,
            startDate: startDate,
            endDate: endDate,
            communicationType: communicationType,
            communicationLink: communicationLink,
            startAddress: startAddress,
            endAddress: endAddress,
            type: type,
            difficulty: data.difficulty,
            maxSeats: maxSeats,
            time: time,
            length: length,
    
            banner: data.banner,
    
            startLocation: {
                type: "Point",
                coordinates: [data.startLocation.coordinates[0], data.startLocation.coordinates[1]]
            },
    
            endLocation: {
                type: "Point",
                coordinates: [data.endLocation.coordinates[0], data.endLocation.coordinates[1]]
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

//Jaskeerat Code

async function get_org_rides(data) {
    try {
        await connect_to_db();
        const _id = data._id;
        console.log("Inside ride fetcher, ", _id);

        const result = await Ride.find(
            { userId: new mongoose.Types.ObjectId(_id) },
            { _id: 1, title: 1, description: 1, banner: 1, difficulty: 1, type: 1}
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
                    status: 'Upcoming'
                },
                distanceField: "dist.calculated",
                spherical: true
            } },
            { $limit: 20 },
            { $project : { _id: 1, title: 1, description: 1, banner: 1, difficulty: 1, type: 1} }
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
            { $project : { _id: 1, title: 1, description: 1, banner: 1, difficulty: 1, type: 1} },
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
            { $project : { _id: 1, title: 1, description: 1, banner: 1, difficulty: 1, type: 1} },
            { $sort: { startDate: 1 } }
        ]);

        if(res.length == 0) {
            return {
                success: false,
                message: 'No rides available'
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
    ride_details,
    create_ride,
    get_org_rides,
    get_rides,
    get_rides_type_based,
    get_rides_diff_based
};