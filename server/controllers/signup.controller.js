const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = require('./models/user.model.js');
const rider = require('./models/rider.model.js');
const organizer = require('./models/organizer.model.js');
const sponsor = require('./models/sponsor.model.js');

require('dotenv').config();

async function connect_to_db() {
    await mongoose.connect(process.env.MONGODB_URI_JAS)
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.error(err);
    })
}

async function disconnect() {
    await mongoose.disconnect();
}

async function insert_role_based(roleDetails, role, newObjId, session) {
    try {

        if(role == 'rider') {

            const name = roleDetails.name, age = roleDetails.age, city = roleDetails.city, socialLinks = roleDetails.socialLinks, bikes = roleDetails.bikes, ridingStyle = roleDetails.ridingStyle, bio = roleDetails.bio;

            const newRider = new rider({
                userId: newObjId,
                name: name,
                age: age,
                city: city,
                socialLinks: socialLinks,
                bikes: bikes,
                ridingStyle: ridingStyle,
                bio: bio
            });

            await newRider.save({session})
            console.log("rider successfully registered");
        }
        else if(role == 'organizer') {

            const name = roleDetails.name, desc = roleDetails.description, socialLinks = roleDetails.socialLinks, website = roleDetails.website, gstin = roleDetails.gstin;

            const newOrg = new organizer({
                userId: newObjId,
                name: name,
                description: desc,
                socialLinks: socialLinks,
                website: website,
                GSTIN: gstin
            });

            await newOrg.save({session});
            console.log("organizer registered successfully");
        }
    }
    catch(err) {
        throw err;
    }
}

async function sign_up_user(data) {

    await connect_to_db();

    console.log(data, "inside ");
    const username = data.username, email = data.email, pass = data.password, role = data.role;
    const roleDetails = data.roleDetails;

    if (!['rider', 'organizer', 'sponsor'].includes(role)) {
        throw new Error("Invalid role");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const hash = await bcrypt.hash(pass, 10);

    let createdAt = new Date().toISOString();
    let updatedAt = createdAt;
    
    const newUser = new user({
        userName: username,
        email: email, 
        password: hash,
        role: role,
        createdAt: createdAt,
        updatedAt: updatedAt
    });

    let newObjId = null;
    
    try {
        const res = await newUser.save({session});
        console.log("user registered");

        newObjId = res._id;

        await insert_role_based(roleDetails, role, newObjId, session);

        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            data: {
                _id: newObjId,
                username: username,
                email: email,
                role: role
            }   
        };
    }
    catch(err) {
        await session.abortTransaction();
        console.error(err);
        session.endSession();

        throw err;
    }
}

data = {
    username: 'adarsh2',
    email: 'ad@@mai.c',
    password: 'abc123',
    role: 'organizer',
    roleDetails: {
        name: "re",
        description: "i am the best",
        socialLinks: "www.google.com",
        website: "www.youtube.com",
        gstin:  12212
    }
}

module.exports = {
    sign_up_user
};