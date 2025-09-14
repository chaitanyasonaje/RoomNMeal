const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { auth } = require('../middlewares/auth');
const emailService = require('../utils/emailService');
const passwordValidator = require('../utils/passwordValidator');
const otpService = require('../utils/otpService');
const { authRateLimit, otpRateLimit, passwordResetRateLimit } = require('../middlewares/rateLimiter');

const router = express.Router();

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'roomnmeal-super-secret-jwt-key-2024-production-fallback';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// Register user
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate password strength
    const passwordValidation = passwordValidator.validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: 'Password validation failed',
        errors: passwordValidation.errors
      });
    }

    // Check if JWT_SECRET is configured (with fallback)
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET not configured, using fallback secret');
    }

    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      role
    });

    await user.save();

    // Generate and send email OTP
    const emailOTP = user.generateEmailOTP();
    await user.save();

    try {
      await otpService.sendEmailOTP(user.email, emailOTP, 'verification');
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      message: 'User registered successfully. Please verify your email with the OTP sent.',
      userId: user._id,
      email: user.email,
      requiresVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if JWT_SECRET is configured (with fallback)
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET not configured, using fallback secret');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        userId: user._id
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.getProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user.getProfile() });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify email OTP
router.post('/verify-email', otpRateLimit, async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!otpService.validateOTPFormat(otp)) {
      return res.status(400).json({ message: 'Invalid OTP format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidOTP = user.verifyEmailOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.clearOTPs();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully',
      token,
      user: user.getProfile()
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend email OTP
router.post('/resend-email-otp', otpRateLimit, async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const emailOTP = user.generateEmailOTP();
    await user.save();

    try {
      await otpService.sendEmailOTP(user.email, emailOTP, 'verification');
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.json({ message: 'Verification email sent successfully' });

  } catch (error) {
    console.error('Resend email OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify phone OTP
router.post('/verify-phone', otpRateLimit, async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!otpService.validateOTPFormat(otp)) {
      return res.status(400).json({ message: 'Invalid OTP format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidOTP = user.verifyPhoneOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.clearOTPs();
    await user.save();

    res.json({ message: 'Phone verified successfully' });

  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send phone OTP
router.post('/send-phone-otp', otpRateLimit, async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const phoneOTP = user.generatePhoneOTP();
    await user.save();

    try {
      await otpService.sendSMSOTP(phone, phoneOTP, 'verification');
    } catch (smsError) {
      console.error('Failed to send SMS:', smsError);
      return res.status(500).json({ message: 'Failed to send SMS' });
    }

    res.json({ message: 'SMS sent successfully' });

  } catch (error) {
    console.error('Send phone OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request password reset
router.post('/forgot-password', passwordResetRateLimit, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset OTP
    const resetOTP = user.generateResetOTP();
    await user.save();

    // Send password reset OTP via email
    try {
      await otpService.sendEmailOTP(user.email, resetOTP, 'reset');
    } catch (emailError) {
      console.error('Failed to send password reset OTP:', emailError);
      return res.status(500).json({ message: 'Failed to send reset OTP' });
    }

    res.json({ 
      message: 'Password reset OTP sent to your email',
      userId: user._id
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password with OTP
router.post('/reset-password', passwordResetRateLimit, async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    // Validate password strength
    const passwordValidation = passwordValidator.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: 'Password validation failed',
        errors: passwordValidation.errors
      });
    }

    if (!otpService.validateOTPFormat(otp)) {
      return res.status(400).json({ message: 'Invalid OTP format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidOTP = user.verifyResetOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.clearOTPs();
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify reset OTP
router.post('/verify-reset-otp', otpRateLimit, async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!otpService.validateOTPFormat(otp)) {
      return res.status(400).json({ message: 'Invalid OTP format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidOTP = user.verifyResetOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Reset OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 