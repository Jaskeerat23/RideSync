const express = require('express');
const { sign_up_user } = require('../signupbackend.js');
const login_user = require('../controllers/login.controller.js');
const create_jwt_token = require('../controllers/session.controller.js');
const user = require('../models/user.model.js');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.post('/signup', async function signupservice(req, res) {
    const data = req.body;
    try {
        console.log(data);
        const result = await sign_up_user(data);
        console.log("result data from singup is ", result.data);
        const jwt = await create_jwt_token(result.data);

        res.cookie('token', jwt, { maxAge: 60*60*24*7*1000 });

        res.status(201).json({
            success: true,
            data: {
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
});

router.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const result = await login_user(req.body);
        console.log(result);
        if(!result.success) {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
        else {
            const jwt = await create_jwt_token(result.data);
            res.cookie('token', jwt, { maxAge: 60*60*24*7*1000 });
            res.status(201).json({
                success: true,
                data:  {
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
});

module.exports = router;
