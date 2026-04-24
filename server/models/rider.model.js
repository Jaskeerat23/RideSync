const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true},
    name: {type: String},
    age: {type: Number},
    city: {type: String},
    socialLinks: {type: String},
    bikes: {type: [String]},
    ridingStyle: {type: [String]},
    bio: {type: String}
})

const rider = new mongoose.model('Riders', riderSchema, 'Riders');

module.exports = rider;