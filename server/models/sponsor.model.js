const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true},
    brandName: {type: String, required: true},
    website: {type: String},
    description: {type: String}
})

const sponsor = new mongoose.model('Sponsors', sponsorSchema, 'Sponsors');

module.exports = sponsor;