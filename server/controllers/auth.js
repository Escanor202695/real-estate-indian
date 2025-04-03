const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Configure passport for Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (!user) {
      // Create new user from Google profile
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: Math.random().toString(36).slice(-8), // Random password
        googleId: profile.id
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = profile.id;
      await user.save();
    }
    
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Match password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Google OAuth login/register
// @route   GET /api/auth/google
// @access  Public
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.redirect('/login?error=google_auth_failed');
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Redirect with token and user data in URL parameters
    // The frontend will handle parsing these and setting in localStorage
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth-callback` +
      `?token=${token}` +
      `&user=${encodeURIComponent(JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }))}`
    );
  })(req, res, next);
};

// @desc    Forgot password - Generate OTP and send email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      // We don't want to reveal if the email exists or not for security reasons
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset code'
      });
    }
    
    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry time (15 minutes from now)
    const otpExpiry = Date.now() + 15 * 60 * 1000;
    
    // Hash the OTP before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    
    // Save OTP and expiry to user document
    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordExpires = otpExpiry;
    await user.save();
    
    // In a real environment, send email with OTP
    // For this demo, we'll just console.log the OTP
    console.log(`Password reset OTP for ${email}: ${otp}`);
    
    res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset code'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    // Find user by email
    const user = await User.findOne({ 
      email, 
      resetPasswordExpires: { $gt: Date.now() } 
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset code is invalid or has expired'
      });
    }
    
    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp, user.resetPasswordOtp);
    
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid code'
      });
    }
    
    // Set new password
    user.password = newPassword;
    
    // Clear reset password fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    // Generate token for automatic login
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
