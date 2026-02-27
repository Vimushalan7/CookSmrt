const express = require('express');
const router = express.Router();
const { signup, login, firebaseLogin } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
// Legacy send-otp and verify-otp routes removed. Using firebase-login only.
router.post('/firebase-login', firebaseLogin);

module.exports = router;
