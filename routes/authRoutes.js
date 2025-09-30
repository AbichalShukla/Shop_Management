 const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUser, verifyOTP } = require('../Controller/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login',loginUser);
router.get('/user', authMiddleware, getUser);       
module.exports = router;