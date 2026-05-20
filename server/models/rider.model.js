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


const riderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true},
    name: {type: String},
    age: {type: Number},
    city: {type: String},
    cityLocation: locationSchema,
    socialLinks: {type: String},
    bikes: {type: [String]},
    ridingStyle: {type: [String]},
    bio: {type: String}
})

const rider = mongoose.model('Riders', riderSchema, 'Riders');

module.exports = rider;