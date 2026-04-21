const jwt = require('jsonwebtoken');
require('dotenv').config();

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(400).json({
                success: false,
                message: "No Token Found"
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY_JWT);
        req.user = decode;
        next();
    }
    catch(err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}

function authorizeRole(role) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if(userRole != role) {
            return res.status(403).json({
                success: false,
                message: "User not authorized"
            });
        }
        next();
    }
}

module.exports = {
    authMiddleware,
    authorizeRole
};