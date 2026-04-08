const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String},
    role: {type: String},
    createdAt: {type: String},
    updatedAt: {type: String},
});

const user = new mongoose.model('Users', userSchema, 'Users');

module.exports = user;