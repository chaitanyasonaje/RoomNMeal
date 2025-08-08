const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middlewares/auth');

const router = express.Router();

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'roomnmeal-super-secret-jwt-key-2024-production-fallback';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

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
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
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

module.exports = router; 