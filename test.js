// // const bcrypt = require('bcrypt');

// // const { promiseHooks } = require("node:v8");

// // let pass = "Jas";
// // let hashPass = bcrypt.hash(pass, 10).then((err, hash) => {
// //     console.log("hash pass is", err);
// // });

// // bcrypt.hash(pass, 10, (err, hash) => {
// //     console.log("Hash pass is ", hash);
// // })

// // // console.log("Hash Pass is ", hashPass);
// // console.log("Orign Pass is ", pass);    

// // function getdata() {
// //     return new Promise((res, rej) => {
// //         setTimeout(() => {
// //             console.log("Printing the data successfully");
// //             res(200);
// //         }, 5000);
        
// //     });
// // }

// // async function printit() {
// //     await getdata();
// //     console.log("printing it");
// // }

// // printit();

// // const mdb = require('mongodb');
// // const mongoose = require('mongoose');
// // require('dotenv').config();

// // mongoose.connect(process.env.MONGODB_URI_ADITYA)
// // .then(() => {
// //     console.log("Successfully connected with Database");
// // })
// // .catch((err) => {
// //     console.log(err);
// // })


// const mongoose = require('mongoose');
// const User = require('./server/models/user.model');
// const Organizer = require('./server/models/organizer.model');
// const Ride = require('./server/models/ride.model');
// require('dotenv').config();
// const bcrypt = require('bcrypt');

// const MONGO_URI = process.env.MONGODB_URI_JAS;


// async function seed() {
//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log("DB Connected");

//         // साफ run
//         await User.deleteMany({});
//         await Organizer.deleteMany({});
//         await Ride.deleteMany({});

//         const hashedPass = await bcrypt.hash("pass", 10);

//         // 1️⃣ Users
//         const users = await User.insertMany([
//             { userName: "rider_one", email: "r1@mail.com", password: hashedPass, role: "organizer", createdAt: new Date(), updatedAt: new Date() },
//             { userName: "rider_two", email: "r2@mail.com", password: hashedPass, role: "organizer", createdAt: new Date(), updatedAt: new Date() },
//             { userName: "rider_three", email: "r3@mail.com", password: hashedPass, role: "organizer", createdAt: new Date(), updatedAt: new Date() },
//             { userName: "rider_four", email: "r4@mail.com", password: hashedPass, role: "organizer", createdAt: new Date(), updatedAt: new Date() },
//             { userName: "rider_five", email: "r5@mail.com", password: hashedPass, role: "organizer", createdAt: new Date(), updatedAt: new Date() }
//         ]);

//         // 2️⃣ Organizers
//         const organizers = await Organizer.insertMany([
//             { userId: users[0]._id, name: "Doon Riders", description: "Local rides", website: "doon.com", GSTIN: "GST001" },
//             { userId: users[1]._id, name: "Hill Explorers", description: "Mountain rides", website: "hill.com", GSTIN: "GST002" },
//             { userId: users[2]._id, name: "Highway Crew", description: "Long rides", website: "highway.com", GSTIN: "GST003" },
//             { userId: users[3]._id, name: "Adventure Club", description: "Extreme rides", website: "adv.com", GSTIN: "GST004" },
//             { userId: users[4]._id, name: "City Bikers", description: "Urban rides", website: "city.com", GSTIN: "GST005" }
//         ]);

//         // 3️⃣ Rides (linked to organizers)
//         const rides = await Ride.insertMany([
//             {
//                 userId: users[0]._id,
//                 startLocation: "Dehradun",
//                 endLocation: "Mussoorie",
//                 entryFee: 200,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "06:00 AM",
//                 length: 35,
//                 difficulty: "Easy",
//                 type: "City",
//                 maxSeats: 20,
//                 bookedSeats: 5,
//                 title: "Doon to Mussoorie Ride"
//             },
//             {
//                 userId: users[1]._id,
//                 startLocation: "Rishikesh",
//                 endLocation: "Auli",
//                 entryFee: 800,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "07:00 AM",
//                 length: 250,
//                 difficulty: "Hard",
//                 type: "Adventure",
//                 maxSeats: 15,
//                 bookedSeats: 7,
//                 title: "Auli Snow Ride"
//             },
//             {
//                 userId: users[2]._id,
//                 startLocation: "Delhi",
//                 endLocation: "Jaipur",
//                 entryFee: 500,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "05:00 AM",
//                 length: 280,
//                 difficulty: "Moderate",
//                 type: "Highway",
//                 maxSeats: 30,
//                 bookedSeats: 10,
//                 title: "Delhi Jaipur Ride"
//             },
//             {
//                 userId: users[3]._id,
//                 startLocation: "Manali",
//                 endLocation: "Leh",
//                 entryFee: 1500,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "06:00 AM",
//                 length: 470,
//                 difficulty: "Extreme",
//                 type: "OffRoad",
//                 maxSeats: 12,
//                 bookedSeats: 6,
//                 title: "Leh Expedition"
//             },
//             {
//                 userId: users[4]._id,
//                 startLocation: "Bangalore",
//                 endLocation: "Nandi Hills",
//                 entryFee: 150,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "04:30 AM",
//                 length: 60,
//                 difficulty: "Easy",
//                 type: "City",
//                 maxSeats: 20,
//                 bookedSeats: 12,
//                 title: "Nandi Hills Ride"
//             },

//             // 5 more rides (reuse organizers)
//             {
//                 userId: users[0]._id,
//                 startLocation: "Dehradun",
//                 endLocation: "Chakrata",
//                 entryFee: 400,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "06:30 AM",
//                 length: 90,
//                 difficulty: "Moderate",
//                 type: "Adventure",
//                 maxSeats: 18,
//                 bookedSeats: 8,
//                 title: "Chakrata Ride"
//             },
//             {
//                 userId: users[1]._id,
//                 startLocation: "Haridwar",
//                 endLocation: "Rishikesh",
//                 entryFee: 100,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "05:30 AM",
//                 length: 25,
//                 difficulty: "Easy",
//                 type: "City",
//                 maxSeats: 25,
//                 bookedSeats: 15,
//                 title: "Ganga Ride"
//             },
//             {
//                 userId: users[2]._id,
//                 startLocation: "Chandigarh",
//                 endLocation: "Shimla",
//                 entryFee: 600,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "06:00 AM",
//                 length: 120,
//                 difficulty: "Moderate",
//                 type: "Highway",
//                 maxSeats: 22,
//                 bookedSeats: 9,
//                 title: "Shimla Ride"
//             },
//             {
//                 userId: users[3]._id,
//                 startLocation: "Spiti",
//                 endLocation: "Kaza",
//                 entryFee: 1200,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "07:00 AM",
//                 length: 200,
//                 difficulty: "Extreme",
//                 type: "OffRoad",
//                 maxSeats: 10,
//                 bookedSeats: 4,
//                 title: "Spiti Ride"
//             },
//             {
//                 userId: users[4]._id,
//                 startLocation: "Mumbai",
//                 endLocation: "Pune",
//                 entryFee: 300,
//                 startDate: new Date(),
//                 endDate: new Date(),
//                 time: "05:00 AM",
//                 length: 150,
//                 difficulty: "Moderate",
//                 type: "Highway",
//                 maxSeats: 25,
//                 bookedSeats: 11,
//                 title: "Mumbai Pune Ride"
//             }
//         ]);

//         console.log("Users + Organizers + Rides inserted ✅");
//         process.exit();

//     } catch (err) {
//         console.error(err);
//         process.exit(1);
//     }
// }

// seed();


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// ── Schemas (inline to keep seed self-contained) ──────────────────────────────

const userSchema = new mongoose.Schema({
    userName:  { type: String, unique: true },
    email:     { type: String, unique: true },
    password:  { type: String },
    role:      { type: String },
    pfp:       { type: String, default: `${process.env.R2_PUBLIC_URL}/pfp/default_pfp.png` },
    createdAt: { type: String },
    updatedAt: { type: String },
});
const User = mongoose.model('Users', userSchema, 'Users');

const orgSchema = new mongoose.Schema({
    userId:      { type: mongoose.Schema.Types.ObjectId, unique: true },
    name:        { type: String },
    description: { type: String },
    socialLinks: { type: String },
    website:     { type: String },
    GSTIN:       { type: String },
});
const Organizer = mongoose.model('Organizers', orgSchema, 'Organizers');

const locationSchema = {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
};
const rideSchema = new mongoose.Schema({
    userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'Organizers', required: true },
    sponsorId:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sponsors' }],
    startLocation:     locationSchema,
    endLocation:       locationSchema,
    entryFee:          { type: Number, default: 0 },
    startDate:         { type: Date, required: true },
    endDate:           { type: Date, required: true },
    time:              { type: String, required: true },
    length:            Number,
    difficulty:        { type: String, enum: ['Easy', 'Moderate', 'Hard', 'Extreme'] },
    type:              { type: String, enum: ['Adventure', 'Highway', 'City', 'OffRoad'] },
    maxSeats:          { type: Number, required: true },
    bookedSeats:       { type: Number, default: 0 },
    title:             { type: String, required: true },
    status:            { type: String, enum: ['Upcoming', 'Ongoing', 'Cancelled', 'Completed'], default: 'Upcoming' },
    communicationLink: String,
    communicationType: { type: String, enum: ['telegram', 'whatsapp', 'instagram'] },
    banner:            { type: String },
    startAddress:      String,
    endAddress:        String,
    description:       String,
}, { timestamps: true });
rideSchema.index({ startLocation: '2dsphere' });
const Ride = mongoose.model('Rides', rideSchema, 'Rides');

// ── Organizer seed data ───────────────────────────────────────────────────────

const organizerData = [
    {
        user: {
            userName: 'royal_enfield',
            email:    'royalenfield@gmail.com',
            password: 'Pass123_',
            role:     'organizer',
        },
        org: {
            name:        'Royal Enfield',
            description: 'Royal Enfield is the world\'s oldest motorcycle brand in continuous production. We unite riders across India and beyond through the pure joy of motorcycling — from the Himalayas to the coast, every road is our canvas. Our rides celebrate the spirit of adventure, camaraderie, and the open road.',
            socialLinks: 'https://www.instagram.com/royalenfield/',
            website:     'https://www.royalenfield.com/in/en/home/',
            GSTIN:       '29AABCR1234A1Z5',
        },
    },
    {
        user: {
            userName: 'harley_davidson',
            email:    'harleydavidson@gmail.com',
            password: 'Pass123_',
            role:     'organizer',
        },
        org: {
            name:        'Harley Davidson',
            description: 'Harley-Davidson is more than a motorcycle — it\'s a lifestyle. Since 1903, we have stood for freedom, power, and the brotherhood of the road. Our organised rides bring together HOG members and enthusiasts for unforgettable journeys across India\'s most iconic routes.',
            socialLinks: 'https://www.instagram.com/harleydavidsoncasa/',
            website:     'https://www.harley-davidson.com/in/en/index.html',
            GSTIN:       '27AABCH5678B1Z3',
        },
    },
    {
        user: {
            userName: 'triumph_1',
            email:    'triumph@gmail.com',
            password: 'Pass123_',
            role:     'organizer',
        },
        org: {
            name:        'Triumph',
            description: 'Triumph Motorcycles has been defining the art of the ride since 1902. From the Tiger\'s off-road prowess to the Bonneville\'s timeless style, our rides are curated experiences for those who demand more from every kilometer. Join us and ride the British legend.',
            socialLinks: 'https://www.instagram.com/triumphdehradun/',
            website:     'https://www.triumphmotorcycles.in/',
            GSTIN:       '06AABCT9012C1Z1',
        },
    },
    {
        user: {
            userName: 'honda_1',
            email:    'honda@gmail.com',
            password: 'Pass123_',
            role:     'organizer',
        },
        org: {
            name:        'Honda',
            description: 'Honda Motorcycle & Scooter India brings the joy of riding to millions. Our community rides are built on the pillars of safety, fun, and exploration — welcoming riders of all experience levels. Whether it\'s a city loop or a long-distance highway run, Honda rides are for everyone.',
            socialLinks: 'https://www.instagram.com/hondamotorcyclethailand/',
            website:     'https://www.honda2wheelersindia.com/',
            GSTIN:       '19AABCH3456D1Z7',
        },
    },
];

// ── Rides per organizer (5 each) ──────────────────────────────────────────────

const ridesPerOrganizer = [
    // Royal Enfield — 5 rides
    [
        {
            title:             'Himalayan Odyssey',
            description:       'The legendary Royal Enfield Himalayan Odyssey takes you through some of the highest motorable roads in the world. Crossing Rohtang, Baralacha La, and Tanglang La, this is the ultimate test of rider and machine.',
            startAddress:      'Manali, Himachal Pradesh',
            endAddress:        'Leh, Ladakh',
            startLocation:     { type: 'Point', coordinates: [77.1892, 32.2396] },
            endLocation:       { type: 'Point', coordinates: [77.5771, 34.1526] },
            difficulty:        'Extreme',
            type:              'Adventure',
            entryFee:          2500,
            length:            490,
            maxSeats:          40,
            bookedSeats:       28,
            time:              '06:00 AM',
            startDate:         new Date('2025-06-15'),
            endDate:           new Date('2025-06-22'),
            communicationType: 'telegram',
            communicationLink: 'https://t.me/himalayan_odyssey',
            banner:            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        },
        {
            title:             'Rajasthan Desert Storm',
            description:       'Ride through the golden Thar Desert under a blazing Rajasthani sky. From Jodhpur\'s blue city to Jaisalmer\'s golden fort, this route is a postcard at every turn.',
            startAddress:      'Jodhpur, Rajasthan',
            endAddress:        'Jaisalmer, Rajasthan',
            startLocation:     { type: 'Point', coordinates: [73.0243, 26.2389] },
            endLocation:       { type: 'Point', coordinates: [70.9083, 26.9157] },
            difficulty:        'Moderate',
            type:              'Highway',
            entryFee:          1200,
            length:            280,
            maxSeats:          60,
            bookedSeats:       42,
            time:              '07:00 AM',
            startDate:         new Date('2025-07-10'),
            endDate:           new Date('2025-07-12'),
            communicationType: 'whatsapp',
            communicationLink: 'https://wa.me/919876543210',
            banner:            'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
        },
        {
            title:             'Coorg Coffee Trail',
            description:       'Mist-covered hills, coffee estates, and narrow jungle roads define this off-road gem in Karnataka. A paradise for riders who love greenery and technical terrain.',
            startAddress:      'Mysuru, Karnataka',
            endAddress:        'Madikeri, Coorg',
            startLocation:     { type: 'Point', coordinates: [76.6394, 12.2958] },
            endLocation:       { type: 'Point', coordinates: [75.7382, 12.4244] },
            difficulty:        'Hard',
            type:              'OffRoad',
            entryFee:          800,
            length:            120,
            maxSeats:          25,
            bookedSeats:       17,
            time:              '08:00 AM',
            startDate:         new Date('2025-08-05'),
            endDate:           new Date('2025-08-06'),
            communicationType: 'instagram',
            communicationLink: 'https://www.instagram.com/royalenfield/',
            banner:            'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
        },
        {
            title:             'Spiti Valley Expedition',
            description:       'One of the most remote and dramatic landscapes on Earth. The Spiti Valley ride crosses ancient monasteries, barren moonscapes, and rivers with no bridges. Not for the faint-hearted.',
            startAddress:      'Shimla, Himachal Pradesh',
            endAddress:        'Kaza, Spiti Valley',
            startLocation:     { type: 'Point', coordinates: [77.1734, 31.1048] },
            endLocation:       { type: 'Point', coordinates: [78.0698, 32.2273] },
            difficulty:        'Extreme',
            type:              'Adventure',
            entryFee:          3000,
            length:            410,
            maxSeats:          20,
            bookedSeats:       14,
            time:              '05:30 AM',
            startDate:         new Date('2025-09-01'),
            endDate:           new Date('2025-09-05'),
            communicationType: 'telegram',
            communicationLink: 'https://t.me/spiti_re',
            banner:            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        },
        {
            title:             'Coastal Karnataka Cruise',
            description:       'Ride along the pristine Konkan coastline from Mangaluru to Goa. Sea breeze, fish thalis, and smooth NH-66 make this one of India\'s most enjoyable highway rides.',
            startAddress:      'Mangaluru, Karnataka',
            endAddress:        'Panaji, Goa',
            startLocation:     { type: 'Point', coordinates: [74.8559, 12.9141] },
            endLocation:       { type: 'Point', coordinates: [73.8278, 15.4909] },
            difficulty:        'Easy',
            type:              'Highway',
            entryFee:          600,
            length:            350,
            maxSeats:          80,
            bookedSeats:       53,
            time:              '07:30 AM',
            startDate:         new Date('2025-10-18'),
            endDate:           new Date('2025-10-19'),
            communicationType: 'whatsapp',
            communicationLink: 'https://wa.me/919876500001',
            banner:            'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
        },
    ],

    // Harley Davidson — 5 rides
    [
        {
            title:             'HOG Mumbai Night Thunder',
            description:       'The city never sleeps and neither do we. The HOG Mumbai chapter\'s signature night ride takes you through the iconic Marine Drive, Bandra-Worli Sea Link, and the empty Eastern Freeway at midnight.',
            startAddress:      'Andheri, Mumbai',
            endAddress:        'Marine Drive, Mumbai',
            startLocation:     { type: 'Point', coordinates: [72.8479, 19.1136] },
            endLocation:       { type: 'Point', coordinates: [72.8231, 18.9438] },
            difficulty:        'Easy',
            type:              'City',
            entryFee:          500,
            length:            45,
            maxSeats:          50,
            bookedSeats:       35,
            time:              '11:00 PM',
            startDate:         new Date('2025-06-28'),
            endDate:           new Date('2025-06-29'),
            communicationType: 'telegram',
            communicationLink: 'https://t.me/hog_mumbai',
            banner:            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
        },
        {
            title:             'Freedom Run — Pune to Mahabaleshwar',
            description:       'Switchbacks, waterfalls, and misty ghats — the Pune to Mahabaleshwar run is a Harley rider\'s dream. The thundering V-twin sounds even better echoing off the Western Ghats.',
            startAddress:      'Pune, Maharashtra',
            endAddress:        'Mahabaleshwar, Maharashtra',
            startLocation:     { type: 'Point', coordinates: [73.8567, 18.5204] },
            endLocation:       { type: 'Point', coordinates: [73.6583, 17.9235] },
            difficulty:        'Moderate',
            type:              'Adventure',
            entryFee:          1000,
            length:            120,
            maxSeats:          35,
            bookedSeats:       22,
            time:              '07:00 AM',
            startDate:         new Date('2025-07-20'),
            endDate:           new Date('2025-07-21'),
            communicationType: 'whatsapp',
            communicationLink: 'https://wa.me/919000000001',
            banner:            'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=800&q=80',
        },
        {
            title:             'Iron Road — Delhi to Chandigarh',
            description:       'The classic north India highway blast. NH-44 is wide, fast, and perfect for the Fat Boy. Breakfast in Delhi, lunch at the Rock Garden in Chandigarh.',
            startAddress:      'Connaught Place, Delhi',
            endAddress:        'Sector 17, Chandigarh',
            startLocation:     { type: 'Point', coordinates: [77.2090, 28.6315] },
            endLocation:       { type: 'Point', coordinates: [76.7794, 30.7333] },
            difficulty:        'Easy',
            type:              'Highway',
            entryFee:          400,
            length:            250,
            maxSeats:          70,
            bookedSeats:       48,
            time:              '06:30 AM',
            startDate:         new Date('2025-08-15'),
            endDate:           new Date('2025-08-15'),
            communicationType: 'instagram',
            communicationLink: 'https://www.instagram.com/harleydavidsoncasa/',
            banner:            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
        },
        {
            title:             'Monsoon Ghats Blast',
            description:       'Most riders stay home during monsoon. HOG riders don\'t. The Western Ghats in full green bloom, waterfalls pouring across the road, and the smell of wet earth — a sensory overload.',
            startAddress:      'Kolhapur, Maharashtra',
            endAddress:        'Amboli, Maharashtra',
            startLocation:     { type: 'Point', coordinates: [74.2433, 16.7050] },
            endLocation:       { type: 'Point', coordinates: [73.9947, 15.9666] },
            difficulty:        'Hard',
            type:              'OffRoad',
            entryFee:          700,
            length:            80,
            maxSeats:          20,
            bookedSeats:       11,
            time:              '08:00 AM',
            startDate:         new Date('2025-09-14'),
            endDate:           new Date('2025-09-14'),
            communicationType: 'telegram',
            communicationLink: 'https://t.me/hog_ghats',
            banner:            'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
        },
        {
            title:             'Rann of Kutch Run',
            description:       'The white salt desert of Kutch is unlike anywhere else on Earth. Riding across the Rann at sunset, with nothing but flat horizon in every direction, is a meditative, unforgettable experience.',
            startAddress:      'Bhuj, Gujarat',
            endAddress:        'White Rann, Kutch',
            startLocation:     { type: 'Point', coordinates: [69.6669, 23.2420] },
            endLocation:       { type: 'Point', coordinates: [70.1667, 23.7333] },
            difficulty:        'Moderate',
            type:              'Adventure',
            entryFee:          1500,
            length:            95,
            maxSeats:          45,
            bookedSeats:       29,
            time:              '03:00 PM',
            startDate:         new Date('2025-11-22'),
            endDate:           new Date('2025-11-23'),
            communicationType: 'whatsapp',
            communicationLink: 'https://wa.me/919000000002',
            banner:            'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
        },
    ],

    // Triumph — 5 rides
    [
        {
            title:             'Tiger Trail — Corbett to Nainital',
            description:       'Built for the Tiger, this ride weaves through Jim Corbett\'s jungle fringe before climbing into the Kumaon hills to Nainital. Dense forests, wildlife sightings, and pristine mountain lakes await.',
            startAddress:      'Ramnagar, Uttarakhand',
            endAddress:        'Nainital, Uttarakhand',
            startLocation:     { type: 'Point', coordinates: [79.1288, 29.3948] },
            endLocation:       { type: 'Point', coordinates: [79.4636, 29.3919] },
            difficulty:        'Moderate',
            type:              'Adventure',
            entryFee:          900,
            length:            65,
            maxSeats:          30,
            bookedSeats:       19,
            time:              '07:00 AM',
            startDate:         new Date('2025-06-20'),
            endDate:           new Date('2025-06-21'),
            communicationType: 'telegram',
            communicationLink: 'https://t.me/triumph_dehradun',
            banner:            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
        },
        {
            title:             'Bonneville Boulevard — Pondicherry',
            description:       'The French Quarter of Pondicherry is made for the Bonneville. Cobbled streets, colonial architecture, and a seaside boulevard that feels like it was designed to be ridden on a classic British twin.',
            startAddress:      'Chennai, Tamil Nadu',
            endAddress:        'Pondicherry',
            startLocation:     { type: 'Point', coordinates: [80.2707, 13.0827] },
            endLocation:       { type: 'Point', coordinates: [79.8083, 11.9416] },
            difficulty:        'Easy',
            type:              'Highway',
            entryFee:          500,
            length:            160,
            maxSeats:          55,
            bookedSeats:       38,
            time:              '07:30 AM',
            startDate:         new Date('2025-07-05'),
            endDate:           new Date('2025-07-06'),
            communicationType: 'instagram',
            communicationLink: 'https://www.instagram.com/triumphdehradun/',
            banner:            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
        },
        {
            title:             'Speed Triple Shakedown — Rishikesh',
            description:       'Twisty roads along the Ganges, ashrams, and the suspension bridge at Laxman Jhula. The Speed Triple devours these corners. A spiritual and mechanical experience in equal measure.',
            startAddress:      'Dehradun, Uttarakhand',
            endAddress:        'Rishikesh, Uttarakhand',
            startLocation:     { type: 'Point', coordinates: [78.0322, 30.3165] },
            endLocation:       { type: 'Point', coordinates: [78.2676, 30.0869] },
            difficulty:        'Hard',
            type:              'Adventure',
            entryFee:          600,
            length:            55,
            maxSeats:          20,
            bookedSeats:       13,
            time:              '08:00 AM',
            startDate:         new Date('2025-08-10'),
            endDate:           new Date('2025-08-10'),
            communicationType: 'telegram',
            communicationLink: 'https://t.me/triumph_rishikesh',
            banner:            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        },
        {
            title:             'Scrambler\'s Delight — Hampi',
            description:       'Hampi\'s boulder-strewn landscape is a natural scrambler\'s playground. Ancient ruins, banana plantations, and the Tungabhadra river form the backdrop for an extraordinary off-road adventure.',
            startAddress:      'Hosapete, Karnataka',
            endAddress:        'Hampi, Karnataka',
            startLocation:     { type: 'Point', coordinates: [76.3909, 15.2689] },
            endLocation:       { type: 'Point', coordinates: [76.4600, 15.3350] },
            difficulty:        'Hard',
            type:              'OffRoad',
            entryFee:          750,
            length:            15,
            maxSeats:          15,
            bookedSeats:       9,
            time:              '09:00 AM',
            startDate:         new Date('2025-09-27'),
            endDate:           new Date('2025-09-28'),
            communicationType: 'whatsapp',
            communicationLink: 'https://wa.me/919000000003',
            banner:            'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80',
        },
        {
            title:             'Darjeeling Loop',
            description:       'Tea gardens, toy train crossings, and views of Kangchenjunga on a clear day. The roads to Darjeeling demand respect — narrow, steep, and breathtakingly beautiful.',
            startAddress:      'Siliguri, West Bengal',
            endAddress:        'Darjeeling, West Bengal',
            startLocation:     { type: 'Point', coordinates: [88.4272, 26.7271] },
            endLocation:       { type: 'Point', coordinates: [88.2627, 27.0360] },
            difficulty:        'Moderate',
            type:              'Adventure',
            entryFee:          1100,
            length:            75,
            maxSeats:          25,
            bookedSeats:       16,
            time:              '06:00 AM',
            startDate:         new Date('2025-10-30'),
            endDate:           new Date('2025-10-31'),
            communicationType: 'telegram',
            communicationLink: 'https://t.me/triumph_darjeeling',
            banner:            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        },
    ],

    // Honda — 5 rides
    [
        {
            title:             'CB300R City Blitz — Bangalore',
            description:       'A curated tour of Bangalore\'s best roads — from the smooth stretches of Outer Ring Road to the tree-lined avenues of Cubbon Park. Perfect for new riders looking to explore the city with a group.',
            startAddress:      'Koramangala, Bangalore',
            endAddress:        'Cubbon Park, Bangalore',
            startLocation:     { type: 'Point', coordinates: [77.6245, 12.9352] },
            endLocation:       { type: 'Point', coordinates: [77.5946, 12.9763] },
            difficulty:        'Easy',
            type:              'City',
            entryFee:          200,
            length:            40,
            maxSeats:          100,
            bookedSeats:       67,
            time:              '07:00 AM',
            startDate:         new Date('2025-06-22'),
            endDate:           new Date('2025-06-22'),
            communicationType: 'whatsapp',
            communicationLink: 'https://wa.me/919000000004',
            banner:            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
        },
        {
            title:             'Hornet Highway Run — Hyderabad to Bidar',
            description:       'A straight shot highway run through the Deccan Plateau. Wide roads, minimal traffic, and the historical walled city of Bidar as the destination. Great for building long-distance riding confidence.',
            startAddress:      'Hyderabad, Telangana',
            endAddress:        'Bidar, Karnataka',
            startLocation:     { type: 'Point', coordinates: [78.4867, 17.3850] },
            endLocation:       { type: 'Point', coordinates: [77.5199, 17.9104] },
            difficulty:        'Easy',
            type:              'Highway',
            entryFee:          300,
            length:            145,
            maxSeats:          90,
            bookedSeats:       54,
            time:              '06:30 AM',
            startDate:         new Date('2025-07-13'),
            endDate:           new Date('2025-07-13'),
            communicationType: 'telegram',
            communicationLink: 'https://t.me/honda_hyd',
            banner:            'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
        },
        {
            title:             'Africa Twin Takeover — Aravalli Hills',
            description:       'The Aravalli range offers some of the most underrated off-road terrain in India. Rocky paths, dry riverbeds, and ancient step wells make this a perfect playground for the Africa Twin.',
            startAddress:      'Udaipur, Rajasthan',
            endAddress:        'Kumbhalgarh, Rajasthan',
            startLocation:     { type: 'Point', coordinates: [73.6833, 24.5854] },
            endLocation:       { type: 'Point', coordinates: [73.5876, 25.1497] },
            difficulty:        'Hard',
            type:              'OffRoad',
            entryFee:          1300,
            length:            85,
            maxSeats:          20,
            bookedSeats:       12,
            time:              '08:00 AM',
            startDate:         new Date('2025-08-24'),
            endDate:           new Date('2025-08-25'),
            communicationType: 'instagram',
            communicationLink: 'https://www.instagram.com/hondamotorcyclethailand/',
            banner:            'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
        },
        {
            title:             'Activa Brotherhood — Ooty Nilgiris',
            description:       'You don\'t need a big bike to have a big adventure. This scooter-friendly ride climbs into the Nilgiri hills through 36 hairpin bends to reach Ooty. Open to all Honda riders regardless of CC.',
            startAddress:      'Coimbatore, Tamil Nadu',
            endAddress:        'Ooty, Tamil Nadu',
            startLocation:     { type: 'Point', coordinates: [76.9558, 11.0168] },
            endLocation:       { type: 'Point', coordinates: [76.6950, 11.4102] },
            difficulty:        'Moderate',
            type:              'Adventure',
            entryFee:          400,
            length:            90,
            maxSeats:          120,
            bookedSeats:       83,
            time:              '07:00 AM',
            startDate:         new Date('2025-09-20'),
            endDate:           new Date('2025-09-21'),
            communicationType: 'whatsapp',
            communicationLink: 'https://wa.me/919000000005',
            banner:            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
        },
        {
            title:             'CBR Weekend Warriors — Pune Track Day',
            description:       'Take your CBR to a proper track for a day of controlled, safe, high-speed riding. Coaching sessions, timed laps, and a community of like-minded sport riders. Helmets and gear mandatory.',
            startAddress:      'Balewadi, Pune',
            endAddress:        'Kari Motor Speedway, Pune',
            startLocation:     { type: 'Point', coordinates: [73.7898, 18.5648] },
            endLocation:       { type: 'Point', coordinates: [73.9500, 18.6200] },
            difficulty:        'Hard',
            type:              'City',
            entryFee:          2000,
            length:            30,
            maxSeats:          30,
            bookedSeats:       18,
            time:              '09:00 AM',
            startDate:         new Date('2025-10-05'),
            endDate:           new Date('2025-10-05'),
            communicationType: 'telegram',
            communicationLink: 'https://t.me/honda_cbr_pune',
            banner:            'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=800&q=80',
        },
    ],
];

// ── Clear all collections ─────────────────────────────────────────────────────

async function clearAll() {
    const collections = ['Bookings', 'Organizers', 'Riders', 'Rides', 'Sponsors', 'Users'];
    for (const name of collections) {
        const result = await mongoose.connection.collection(name).deleteMany({});
        console.log(`Cleared ${name}: ${result.deletedCount} docs deleted`);
    }
}

// ── Seed organizers and rides ─────────────────────────────────────────────────

async function seed() {
    const SALT_ROUNDS = 10;

    for (let i = 0; i < organizerData.length; i++) {
        const { user: userData, org: orgData } = organizerData[i];

        // 1. Create User
        const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
        const user = await User.findOneAndUpdate(
            { userName: userData.userName },
            {
                userName:  userData.userName,
                email:     userData.email,
                password:  hashedPassword,
                role:      userData.role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            { upsert: true, returnDocument: 'after' }
        );
        console.log(`User created: ${user.userName} (${user._id})`);

        // 2. Create Organizer linked to User
        const organizer = await Organizer.findOneAndUpdate(
            { userId: user._id },
            { ...orgData, userId: user._id },
            { upsert: true, returnDocument: 'after' }
        );
        console.log(`Organizer created: ${organizer.name}`);

        // 3. Create 5 Rides for this Organizer
        const rides = ridesPerOrganizer[i];
        for (const rideData of rides) {
            await Ride.findOneAndUpdate(
                { title: rideData.title, userId: user._id },
                { ...rideData, userId: user._id },
                { upsert: true, returnDocument: 'after' }
            );
            console.log(`  Ride seeded: ${rideData.title}`);
        }
    }
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main() {
    await mongoose.connect(process.env.MONGODB_URI_JAS);
    console.log('Connected to MongoDB');

    await clearAll();
    await seed();

    await mongoose.disconnect();
    console.log('\nDone.');
}

main().catch(err => {
    console.error('Failed:', err);
    mongoose.disconnect();
    process.exit(1);
});