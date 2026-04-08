const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI_JAS)
.then(() => {
    console.log("Successfully connected to the database");
})
.catch((err) => {
    console.error(err);
})

const userSchema = new mongoose.Schema({
    userName: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String},
    role: {type: String},
    createdAt: {type: String},
    updatedAt: {type: String},
});

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

const user = new mongoose.model('Users', userSchema, 'Users');
const rider = new mongoose.model('Riders', riderSchema, 'Riders');
// const org = new mongoose.model('Organizers', userSchema, 'Organizers');
// const sponsor = new mongoose.model('Sponsors', userSchema, 'Sponsors');

async function sign_up_user(data) {
    const username = data.username, email = data.email, pass = data.password, role = data.role;
    const roleDetails = data.roleDetails;

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
    
    await newUser.save()
    .then(res => {
        newObjId = res._id;
    })
    .catch(err => console.error(err));

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

        await newRider.save()
        .then(() => {
            console.log("Successfully inserted rider");
        })
        .catch((err) => {
            console.error(err);
        })
    }
}

data = {
    username: 'jaskeerat23',
    email: 'jas@mail.com',
    password: 'abc123',
    role: 'rider',
    roleDetails: {
        name: 'Jaskeerat Singh',
        age: 20,
        city: 'dehradun',
        socailLinks: 'whatsapp',
        bikes: ['KTM','ROYAL ENFILED'],
        ridingStyle: ['Adventure', 'offroad'],
        bio: 'i am a rider'
    }
}

sign_up_user(data);
await mongoose.disconnect();