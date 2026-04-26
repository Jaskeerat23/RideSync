const mongoose = require('mongoose');

const locationSchema = {
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
};

const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizers',
        required: true
    },

    sponsorId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sponsors'
        }
    ],

    startLocation: locationSchema,
    endLocation: locationSchema,

    entryFee: {
        type: Number,
        default: 0
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    length: Number,

    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Hard', 'Extreme']
    },

    type: {
        type: String,
        enum: ['Adventure', 'Highway', 'City', 'OffRoad']
    },

    maxSeats: {
        type: Number,
        required: true
    },

    bookedSeats: {
        type: Number,
        default: 0
    },

    title: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Cancelled', 'Completed'],
        default: 'Upcoming'
    },

    communicationLink: String,

    communicationType: {
        type: String,
        enum: ['telegram', 'whatsapp', 'instagram']
    }

}, { timestamps: true });

rideSchema.index({ startLocation: "2dsphere" });

const Ride = mongoose.model('Rides', rideSchema, 'Rides');

module.exports = Ride;