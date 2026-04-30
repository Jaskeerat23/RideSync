const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
console.log(authController);
const express = require('express');
const multer = require('multer');

const upload = multer();
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.post('/login', authController.login);
router.post('/signup', upload.single('pfp'), authController.signup);
router.post('/google_sign_in', authController.google_sign_in);
// router.post('/logout', authMiddleware.authMiddleware, authController.logout_user);

module.exports = router;