
const express = require('express');
const { register, login, getMe, googleAuth, googleCallback } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router;
