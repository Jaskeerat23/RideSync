const mongoose = require('mongoose');
const Ride = require('../models/ride.model');
const Rider = require('../models/rider.model');
const Organizer = require('../models/organizer.model');
require('dotenv').config();

async function connect_to_db() {
    try {
        await mongoose.connect(process.env.MONGODB_URI_JAS);
        console.log("Connection Successful, ride_details");
    }
    catch(err) {
        throw err;
    }
}

/**
 * ride_details
 *
 * Fetches a single ride and attaches role-based permission flags:
 *   - rider     -> canBook
 *   - organizer -> canEdit
 *   - sponsor   -> canContactForSponsor
 *
 * NOTE: The rider canBook check references ride.crossBike and ride.brand.
 * These two fields are not in the current ride schema — the logic below
 * gracefully treats a missing/true crossBike as "any bike welcome", so the
 * code keeps working until those fields get added to ride.model.js.
 */
async function ride_details(rideId, user) {
    try {
        await connect_to_db();

        if(!mongoose.Types.ObjectId.isValid(rideId)) {
            return {
                success: false,
                message: "Invalid ride id"
            };
        }

        const ride = await Ride.findById(rideId);
        if(!ride) {
            return {
                success: false,
                message: "Ride not found"
            };
        }

        const response = { ride: ride };

        // ---------- RIDER ----------
        if(user.role === 'rider') {
            const rider = await Rider.findOne({
                userId: new mongoose.Types.ObjectId(user._id)
            });

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

        return {
            success: true,
            data: response
        };
    }
    catch(err) {
        throw err;
    }
}

module.exports = {
    ride_details
};
