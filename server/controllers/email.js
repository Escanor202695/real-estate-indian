
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// @desc    Send email notification
// @route   POST /api/users/notifications/email
// @access  Public (consider adding protection based on your requirements)
exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, body, isHtml = false } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide to, subject and body fields'
      });
    }

    const transporter = createTransporter();

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM || 'ClickProp Real Estate'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      [isHtml ? 'html' : 'text']: body,
    });

    console.log('Email sent: %s', info.messageId);

    res.status(200).json({
      success: true,
      data: {
        messageId: info.messageId
      }
    });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({
      success: false,
      message: 'Email could not be sent',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Send notification email to specific user
// @route   POST /api/users/notifications/email/:userId
// @access  Private
exports.sendUserNotificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const { message, type, subject: customSubject } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }
    
    // Create subject based on notification type
    let subject = customSubject || 'ClickProp Notification';
    if (!customSubject) {
      if (type === 'property_alert') {
        subject = 'New Properties Matching Your Search';
      } else if (type === 'price_change') {
        subject = 'Price Changed on a Property You're Interested In';
      } else if (type === 'status_change') {
        subject = 'Status Updated on a Property You're Interested In';
      } else if (type === 'account_creation') {
        subject = 'Your New ClickProp Account';
      } else if (type === 'password_reset') {
        subject = 'Reset Your ClickProp Password';
      }
    }
    
    const transporter = createTransporter();

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM || 'ClickProp Real Estate'}" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject,
      [req.body.isHtml ? 'html' : 'text']: message,
    });

    console.log('Email sent to user %s: %s', user.email, info.messageId);

    res.status(200).json({
      success: true,
      data: {
        messageId: info.messageId
      }
    });
  } catch (err) {
    console.error('User notification email error:', err);
    res.status(500).json({
      success: false,
      message: 'Email could not be sent',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
