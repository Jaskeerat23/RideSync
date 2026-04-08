const mongoose = require('mongoose');

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
    ], // optional array

    startLocation: {
        type: String,
        required: true
    },

    endLocation: {
        type: String,
        required: true
    },

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
        type: String, // can upgrade later to Date if needed
        required: true
    },

    length: {
        type: Number 
    },

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

    communicationLink: {
        type: String
    },

    communicationType: {
        type: String,
        enum: ['telegram', 'whatsapp', 'instagram']
    }

    }, {
    timestamps: true // automatically adds createdAt & updatedAt
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;