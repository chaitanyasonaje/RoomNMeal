const express = require('express');
const Room = require('../models/Room');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true })
      .populate('host', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('host', 'name phone');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create room (Host only)
router.post('/', auth, requireRole(['host']), async (req, res) => {
  try {
    const room = new Room({
      ...req.body,
      host: req.user._id
    });

    await room.save();
    res.status(201).json({ message: 'Room created', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update room (Host only)
router.put('/:id', auth, requireRole(['host']), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room updated', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    await room.updateRating();
    res.json({ message: 'Review added', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rooms for the logged-in host
router.get('/host/my-rooms', auth, requireRole(['host']), async (req, res) => {
  try {
    const rooms = await Room.find({ host: req.user._id, isActive: true })
      .sort({ createdAt: -1 });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete room (Host only)
router.delete('/:id', auth, requireRole(['host']), async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({ _id: req.params.id, host: req.user._id });
    if (!room) {
      return res.status(404).json({ message: 'Room not found or not authorized' });
    }
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 