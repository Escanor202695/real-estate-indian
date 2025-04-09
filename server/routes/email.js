
const express = require('express');
const { sendEmail, sendUserNotificationEmail } = require('../controllers/email');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public email route - protect if needed based on your use case
router.post('/users/notifications/email', sendEmail);

// Protected route for user notifications
router.post('/users/notifications/email/:userId', protect, sendUserNotificationEmail);

module.exports = router;
