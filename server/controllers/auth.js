
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Configure passport for Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/google/callback`,
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
        password: crypto.randomBytes(16).toString('hex'), // Random password
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

// Send email helper function
const sendEmail = async (to, subject, htmlContent) => {
  // Create reusable transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send email
  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM || 'ClickProp Real Estate'}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: htmlContent
  });

  return info;
};

// @desc    Register a user with OTP verification
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, otp, sendOtp } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    // If this is an OTP verification request only
    if (sendOtp) {
      // If user already exists with verified status, reject
      if (userExists && userExists.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }
      
      // Generate random 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set OTP expiry time (15 minutes from now)
      const otpExpiry = Date.now() + 15 * 60 * 1000;
      
      // Hash the OTP before storing it
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(generatedOtp, salt);
      
      if (userExists) {
        // Update existing unverified user
        userExists.registrationOtp = hashedOtp;
        userExists.registrationOtpExpires = otpExpiry;
        await userExists.save();
      } else {
        // Create temporary user with OTP
        await User.create({
          name,
          email,
          password,
          phone,
          registrationOtp: hashedOtp,
          registrationOtpExpires: otpExpiry,
          isVerified: false,
          isActive: false
        });
      }
      
      // Send OTP email
      try {
        await sendEmail(
          email,
          'Verify Your ClickProp Account',
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
            <h2 style="color: #2563eb;">Verify Your ClickProp Account</h2>
            <p>Hello ${name},</p>
            <p>Thank you for registering with ClickProp. To complete your registration, please use the following verification code:</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <div style="font-size: 24px; letter-spacing: 5px; font-weight: bold; padding: 15px; background-color: #f3f4f6; border-radius: 4px; display: inline-block;">
                ${generatedOtp}
              </div>
            </div>
            
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            
            <p style="margin-top: 20px;">Thanks,<br>The ClickProp Team</p>
          </div>
          `
        );
      } catch (err) {
        console.error('OTP email error:', err);
        // Continue even if email fails
      }
      
      // Send success response
      return res.status(200).json({
        success: true,
        message: 'Verification code sent to email'
      });
    }
    
    // If this is the final registration with OTP verification
    if (otp) {
      // Find user by email with valid OTP
      const user = await User.findOne({ 
        email,
        registrationOtpExpires: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification code'
        });
      }
      
      // Verify OTP
      const isOtpValid = await bcrypt.compare(otp, user.registrationOtp);
      
      if (!isOtpValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
      }
      
      // Update user to verified status
      user.isVerified = true;
      user.isActive = true;
      user.registrationOtp = undefined;
      user.registrationOtpExpires = undefined;
      
      await user.save();
      
      // Generate token
      const token = generateToken(user._id);
      
      // Send welcome email
      try {
        await sendEmail(
          email,
          'Welcome to ClickProp Real Estate',
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
            <h2 style="color: #2563eb;">Welcome to ClickProp Real Estate!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for joining ClickProp - your new home for finding the perfect property.</p>
            <p>With your new account, you can:</p>
            <ul>
              <li>Save your favorite properties</li>
              <li>Set up property alerts</li>
              <li>Track your search history</li>
              <li>Contact property owners directly</li>
            </ul>
            <p>Start exploring now!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/properties" 
              style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
              Browse Properties
            </a>
            <p style="margin-top: 20px;">If you have any questions, feel free to contact our support team.</p>
            <p>Happy house hunting!</p>
            <p>The ClickProp Team</p>
          </div>
          `
        );
      } catch (err) {
        console.error('Welcome email error:', err);
        // Don't block registration if email fails
      }
      
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
      return;
    }
    
    // Legacy registration flow (without OTP) - should not reach here in new flow
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
      phone,
      isVerified: true // Legacy user is automatically verified
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Send welcome email
    try {
      await sendEmail(
        email,
        'Welcome to ClickProp Real Estate',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #2563eb;">Welcome to ClickProp Real Estate!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for joining ClickProp - your new home for finding the perfect property.</p>
          <p>With your new account, you can:</p>
          <ul>
            <li>Save your favorite properties</li>
            <li>Set up property alerts</li>
            <li>Track your search history</li>
            <li>Contact property owners directly</li>
          </ul>
          <p>Start exploring now!</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/properties" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
            Browse Properties
          </a>
          <p style="margin-top: 20px;">If you have any questions, feel free to contact our support team.</p>
          <p>Happy house hunting!</p>
          <p>The ClickProp Team</p>
        </div>
        `
      );
    } catch (err) {
      console.error('Welcome email error:', err);
      // Don't block registration if email fails
    }
    
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
    
    // Update last login time
    user.lastLogin = Date.now();
    await user.save();
    
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

// Google OAuth Methods
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
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
    
    // Send email with OTP
    try {
      await sendEmail(
        email,
        'Reset Your ClickProp Password',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>You requested to reset your password for your ClickProp account.</p>
          <p>Please use the following verification code to reset your password:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <div style="font-size: 24px; letter-spacing: 5px; font-weight: bold; padding: 15px; background-color: #f3f4f6; border-radius: 4px; display: inline-block;">
              ${otp}
            </div>
          </div>
          
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request to reset your password, please ignore this email or contact our support team if you have concerns.</p>
          
          <p style="margin-top: 20px;">Thanks,<br>The ClickProp Team</p>
        </div>
        `
      );
    } catch (err) {
      console.error('Password reset email error:', err);
      // Continue even if email fails
    }
    
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
