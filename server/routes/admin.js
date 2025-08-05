const express = require('express');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const MessPlan = require('../models/MessPlan');
const Transaction = require('../models/Transaction');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Admin middleware
const adminAuth = [auth, requireRole(['admin'])];

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalRooms,
      totalBookings,
      totalMessPlans,
      pendingVerifications,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      Room.countDocuments(),
      Booking.countDocuments(),
      MessPlan.countDocuments(),
      User.countDocuments({ isVerified: false }),
      Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const stats = {
      totalUsers,
      totalRooms,
      totalBookings,
      totalMessPlans,
      pendingVerifications,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user verification status
router.put('/users/:userId/verify', adminAuth, async (req, res) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isVerified },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User verification updated', user });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status
router.put('/users/:userId/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated', user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all rooms
router.get('/rooms', adminAuth, async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('host', 'name email')
      .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update room status
router.put('/rooms/:roomId/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.roomId,
      { isActive },
      { new: true }
    ).populate('host', 'name email');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room status updated', room });
  } catch (error) {
    console.error('Update room status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'title location')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all mess plans
router.get('/mess-plans', adminAuth, async (req, res) => {
  try {
    const messPlans = await MessPlan.find()
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });

    res.json({ messPlans });
  } catch (error) {
    console.error('Mess plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update mess plan status
router.put('/mess-plans/:messId/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    const messPlan = await MessPlan.findByIdAndUpdate(
      req.params.messId,
      { isActive },
      { new: true }
    ).populate('provider', 'name email');

    if (!messPlan) {
      return res.status(404).json({ message: 'Mess plan not found' });
    }

    res.json({ message: 'Mess plan status updated', messPlan });
  } catch (error) {
    console.error('Update mess plan status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending verifications
router.get('/verifications', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isVerified: false })
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Verifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify user
router.put('/verify/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User verified', user });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 