const authService = require('../services/auth.service');
const create_jwt_token = require('../controllers/session.controller.js');

async function signup(req, res) {
    try {
        const data = req.body;
        console.log(data);
        const result = await authService.sign_up_user(data);
        console.log("result data from singup is ", result.data);
        const jwt = await create_jwt_token(result.data);

        res.cookie('token', jwt, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 60*60*24*7*1000 });

        res.status(201).json({
            success: true,
            data: {
                _id: result.data._id,
                username: result.data.username,
                email: result.data.email,
                role: result.data.role
            }
        });
    }
    catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

async function login(req, res) {
    try {
        const data = req.body;
        console.log(data);
        result = await authService.login_user(data);
        if(!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
        else {
            const jwt = await create_jwt_token(result.data);
            res.cookie('token', jwt, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 60*60*24*7*1000 });
            res.status(200).json({
                success: true,
                data:  {
                    _id: result.data._id,
                    username: result.data.username,
                    email: result.data.email,
                    role: result.data.role
                }
            })
        }
    }
    catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

async function google_sign_in(req, res) {
    try{
        const data = req.body;
        const result = await authService.google_sign_in_user(data);

        if(!result.success) {
            res.status(400).json({
                success: result.success,
                message: result.message
            });
        }

        const jwt = create_jwt_token(result.data);

        res.cookie('token', jwt, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 60*60*24*7*1000 });

        res.status(200).json({
            success: true,
            data: {
                id: result.data._id,
                username: result.data.username,
                email: result.data.email,
                role: result.data.role
            }
        })
    }
    catch(err) {
        throw err;
    }
}

module.exports = {
    login,
    signup,
    google_sign_in
};