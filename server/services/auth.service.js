const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library'); 
require('dotenv').config();

const user = require('../models/user.model.js');
const rider = require('../models/rider.model.js');
const organizer = require('../models/organizer.model.js');
const sponsor = require('../models/sponsor.model.js');
const r2 = require('../config/r2.js');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

async function connect_to_db() {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URI_JAS);
        console.log("Connected Successfully")
    }
    catch(err) {
        throw err;
    }
}

async function google_sign_in_user(data) {
    try{
        await connect_to_db();
        console.log(data);
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken : data.credential,
            audience : process.env.CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        console.log(email);
        const res = await user.findOne({email: email});

        if(res == null) {
            return {
                success: false,
                message: "User Invalid, please sign up"
            }
        }

        const dataOP = {
            _id: res._id,
            username: res.userName,
            email: res.email,
            role: res.role,
            pfp: res.pfp
        };

        return {
            success: true,
            data: dataOP
        };
    }
    catch(err) {
        throw err;
    }
}

async function login_user(data) {
    try {
        await connect_to_db();
        const res = await user.findOne({ userName: data.username }, { _id: 1, userName: 1, password: 1, email: 1, role: 1, pfp: 1 });

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
                    role: res.role,
                    pfp: res.pfp
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

async function insert_role_based(roleDetails, role, newObjId, session) {
    try {

        if(role == 'rider') {

            const name = roleDetails.name, age = roleDetails.age, city = roleDetails.city, socialLinks = roleDetails.socialLinks
            const bikes = roleDetails.bikes, ridingStyle = roleDetails.ridingStyle, bio = roleDetails.bio;
            const display_name = roleDetails.display_name, lat = parseFloat(roleDetails.lat), lng = parseFloat(roleDetails.lng);

            if(!lat || !lng || isNaN(lat) || isNaN(lng)) {
                throw new Error("No Location Entered");
            }

            const newRider = new rider({
                userId: newObjId,
                name: name,
                age: age,
                city: display_name,
                cityLocation: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
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

async function sign_up_user(data, imgFile) {

    await connect_to_db();
    const session = await mongoose.startSession();
    let r2Uploaded = false;
    let params = null;
    try {

        console.log(data, "inside ");
        const username = data.username, email = data.email, pass = data.password, role = data.role;

        if (!['rider', 'organizer', 'sponsor'].includes(role)) {
            throw new Error("Invalid role");
        }

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
    
        const res = await newUser.save({session});
        console.log("user registered");

        const newObjId = res._id;

        if(imgFile) {
            const ext = imgFile.mimetype.split('/')[1]

            params = {
                Bucket: process.env.R2_BUCKET_NAME,
                Key: `pfp/${newObjId}.${ext}`,
                Body: imgFile.buffer,
                ContentType: imgFile.mimetype
            };
            
            const img_res = await r2.send(new PutObjectCommand(params));
            r2Uploaded = true;

            const new_res = await user.updateOne(
                { _id: newObjId },
                { $set: { pfp: `${process.env.R2_PUBLIC_URL}/pfp/${newObjId}.${ext}` } },
                { session }
            );
        }

        await insert_role_based(data, role, newObjId, session);

        await session.commitTransaction();
        session.endSession();

        console.log('returning from service and r2 upload is ', r2Uploaded);

        return {
            success: true,
            data: {
                _id: newObjId,
                username: username,
                email: email,
                role: role,
                pfp: imgFile ? `${process.env.R2_PUBLIC_URL}/pfp/${newObjId}.${imgFile.mimetype.split('/')[1]}` : null
            }
        };
    }
    catch(err) {
        if(r2Uploaded) await r2.send(new DeleteObjectCommand(params))
        await session.abortTransaction();
        console.error(err);
        session.endSession();

        throw err;
    }
}

module.exports = {
    login_user,
    sign_up_user,
    google_sign_in_user
};