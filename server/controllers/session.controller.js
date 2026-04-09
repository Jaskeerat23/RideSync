const jwt = require('jsonwebtoken');
require('dotenv').config();

async function create_jwt_token(payload) {
    try{
        const res = await jwt.sign(payload, process.env.SECRET_KEY_JWT, { expiresIn: 60*60*24*7 });
        console.log(res);
        return res;
    }
    catch(err) {
        throw err
    }
}

module.exports = create_jwt_token;