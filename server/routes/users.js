const express = require('express');
const User = require('../models/User');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ user: req.user.getProfile() });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'collegeName', 'address', 'preferences'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user: user.getProfile() });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get users by role (Admin only)
router.get('/by-role/:role', auth, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 