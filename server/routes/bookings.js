const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Get user's bookings (students see their bookings, hosts see bookings for their rooms)
router.get('/my-bookings', auth, async (req, res) => {
  try {
    let bookings;
    
    if (req.user.role === 'student') {
      bookings = await Booking.find({ student: req.user._id })
        .populate('room')
        .populate('host', 'name phone email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'host') {
      bookings = await Booking.find({ host: req.user._id })
        .populate('room')
        .populate('student', 'name phone email')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('host', 'name phone email')
      .populate('student', 'name phone email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    if (req.user.role !== 'admin' && 
        booking.student._id.toString() !== req.user._id.toString() && 
        booking.host._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking (students only)
router.post('/', auth, requireRole(['student']), async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, additionalServices, specialRequests } = req.body;

    // Validate required fields
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Room ID, check-in and check-out dates are required' });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();

    if (checkInDate <= today) {
      return res.status(400).json({ message: 'Check-in date must be in the future' });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Find room and check availability
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isActive || !room.isVerified) {
      return res.status(400).json({ message: 'Room is not available for booking' });
    }

    if (room.availableRooms <= 0) {
      return res.status(400).json({ message: 'No rooms available' });
    }

    // Check for existing bookings in the same date range
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Room is already booked for these dates' });
    }

    // Calculate total amount
    const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    let totalAmount = room.rent * duration;

    // Add additional services cost
    if (additionalServices) {
      if (additionalServices.meals?.included) {
        totalAmount += (additionalServices.meals.price || 0) * duration;
      }
      if (additionalServices.laundry?.included) {
        totalAmount += additionalServices.laundry.price || 0;
      }
      if (additionalServices.tea?.included) {
        totalAmount += (additionalServices.tea.price || 0) * duration;
      }
    }

    // Create booking
    const booking = new Booking({
      student: req.user._id,
      room: roomId,
      host: room.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalAmount,
      additionalServices,
      specialRequests
    });

    await booking.save();

    // Update room availability
    room.availableRooms -= 1;
    await room.save();

    // Populate booking for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('host', 'name phone email');

    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking: populatedBooking 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (hosts can confirm/cancel, students can cancel)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, reason } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('host', 'name phone email')
      .populate('student', 'name phone email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    const isHost = booking.host._id.toString() === req.user._id.toString();
    const isStudent = booking.student._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isStudent && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate status transitions
    const allowedStatuses = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['active', 'cancelled'],
      active: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!allowedStatuses[booking.status].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${booking.status} to ${status}` 
      });
    }

    // Handle cancellation
    if (status === 'cancelled') {
      if (!reason) {
        return res.status(400).json({ message: 'Cancellation reason is required' });
      }
      
      booking.cancelBooking(reason);
      
      // Restore room availability
      const room = await Room.findById(booking.room);
      if (room) {
        room.availableRooms += 1;
        await room.save();
      }
    } else {
      booking.status = status;
    }

    await booking.save();

    res.json({ 
      message: 'Booking status updated successfully', 
      booking 
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add rating and review (students only, after completion)
router.post('/:id/rating', auth, requireRole(['student']), async (req, res) => {
  try {
    const { type, rating, comment } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed bookings' });
    }

    if (!['room', 'host', 'services'].includes(type)) {
      return res.status(400).json({ message: 'Invalid rating type' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    await booking.addRating(type, rating, comment);

    // Update room/host ratings
    if (type === 'room') {
      await Room.findByIdAndUpdate(booking.room, {
        $inc: { totalRatings: 1, totalRatingScore: rating }
      });
    }

    res.json({ message: 'Rating added successfully', booking });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking statistics (for dashboard)
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'student') {
      stats = {
        total: await Booking.countDocuments({ student: req.user._id }),
        pending: await Booking.countDocuments({ student: req.user._id, status: 'pending' }),
        confirmed: await Booking.countDocuments({ student: req.user._id, status: 'confirmed' }),
        active: await Booking.countDocuments({ student: req.user._id, status: 'active' }),
        completed: await Booking.countDocuments({ student: req.user._id, status: 'completed' })
      };
    } else if (req.user.role === 'host') {
      stats = {
        total: await Booking.countDocuments({ host: req.user._id }),
        pending: await Booking.countDocuments({ host: req.user._id, status: 'pending' }),
        confirmed: await Booking.countDocuments({ host: req.user._id, status: 'confirmed' }),
        active: await Booking.countDocuments({ host: req.user._id, status: 'active' }),
        completed: await Booking.countDocuments({ host: req.user._id, status: 'completed' })
      };
    }

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 