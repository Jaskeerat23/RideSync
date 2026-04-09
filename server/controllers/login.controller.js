const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('../models/user.model');
require('dotenv').config();

async function connect_to_db() {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URI_JAS);
        console.log("Connected Successfully")
    }
    catch(err) {
        throw err;
    }
}

async function login_user(data) {
    try {
        await connect_to_db();
        const res = await user.findOne({ userName: data.username }, { _id: 1, userName: 1, password: 1, email: 1, role: 1 });

        if(res === null) {
            return {
                success: false,
                message: "User Invalid"
            }
        }
        else {

            const hashedPass = res.password;
            const isValid = await bcrypt.compare(data.password, hashedPass);
            if(isValid){
                const dataOP = {
                    _id: res._id,
                    username: res.userName,
                    email: res.email,
                    role: res.role
                };
                return {
                    success: true,
                    data: dataOP
                };
            }
            else {
                return {
                    success: false,
                    message: "Entered Password is incorrect"
                };
            }
        }
    }
    catch(err) {
        throw err;
    }
}

// console.log(login_user({username: 'jas', password: 'we3'}));

module.exports = login_user;