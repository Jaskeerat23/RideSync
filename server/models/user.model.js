const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    userName: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String},
    role: {type: String},
    pfp: {type: String, default: `${process.env.R2_PUBLIC_URL}/pfp/default_pfp.png`},
    createdAt: {type: String},
    updatedAt: {type: String},
});

const user = mongoose.model('Users', userSchema, 'Users');

module.exports = user;