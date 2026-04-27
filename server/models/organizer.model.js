const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, unique: true},
    name: {type: String},
    description: {type: String},
    socialLinks: {type: String},
    website: {type: String},
    GSTIN: {type: String}
})

const org = mongoose.model('Organizers', orgSchema, 'Organizers');

module.exports = org;