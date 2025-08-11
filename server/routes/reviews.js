const express = require('express');
const { auth } = require('../middlewares/auth');
const Review = require('../models/Review');
const Room = require('../models/Room');
const MessPlan = require('../models/MessPlan');
const User = require('../models/User');

const router = express.Router();

// Get reviews for a specific target (room, mess plan, or user)
router.get('/:targetModel/:targetId', async (req, res) => {
  try {
    const { targetModel, targetId } = req.params;
    const { page = 1, limit = 10, rating, sortBy = 'createdAt' } = req.query;

    // Validate target model
    if (!['Room', 'MessPlan', 'User'].includes(targetModel)) {
      return res.status(400).json({ message: 'Invalid target model' });
    }

    // Build query
    const query = { targetId, targetModel, isActive: true };
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case 'helpful':
        sortOptions = { helpfulCount: -1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('userId', 'name profileImage')
      .populate('reply.userId', 'name profileImage')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const total = await Review.countDocuments(query);

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: query },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    const result = {
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      stats: {
        averageRating: avgRating[0]?.avgRating || 0,
        totalReviews: avgRating[0]?.totalReviews || 0
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { targetId, targetModel, rating, title, comment, images } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!targetId || !targetModel || !rating || !title || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate target model
    if (!['Room', 'MessPlan', 'User'].includes(targetModel)) {
      return res.status(400).json({ message: 'Invalid target model' });
    }

    // Check if user has already reviewed this target
    const existingReview = await Review.findOne({ userId, targetId, targetModel });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    // Verify target exists
    let target;
    switch (targetModel) {
      case 'Room':
        target = await Room.findById(targetId);
        break;
      case 'MessPlan':
        target = await MessPlan.findById(targetId);
        break;
      case 'User':
        target = await User.findById(targetId);
        break;
    }

    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }

    // Create review
    const review = new Review({
      userId,
      targetId,
      targetModel,
      rating,
      title,
      comment,
      images: images || []
    });

    await review.save();

    // Populate user info for response
    await review.populate('userId', 'name profileImage');

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    // Update fields
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;

    await review.save();
    await review.populate('userId', 'name profileImage');

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    // Soft delete
    review.isActive = false;
    await review.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

// Mark review as helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.toggleHelpful(userId);
    await review.populate('userId', 'name profileImage');

    res.json({
      message: 'Helpful status updated',
      review
    });
  } catch (error) {
    console.error('Error updating helpful status:', error);
    res.status(500).json({ message: 'Failed to update helpful status' });
  }
});

// Reply to a review (for hosts/providers/admins)
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment) {
      return res.status(400).json({ message: 'Reply comment is required' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user can reply (owner of target or admin)
    let canReply = false;
    
    if (req.user.role === 'admin') {
      canReply = true;
    } else {
      switch (review.targetModel) {
        case 'Room':
          const room = await Room.findById(review.targetId);
          canReply = room && room.host.toString() === userId;
          break;
        case 'MessPlan':
          const messPlan = await MessPlan.findById(review.targetId);
          canReply = messPlan && messPlan.provider.toString() === userId;
          break;
        case 'User':
          canReply = review.targetId.toString() === userId;
          break;
      }
    }

    if (!canReply) {
      return res.status(403).json({ message: 'Not authorized to reply to this review' });
    }

    // Add reply
    review.reply = {
      userId,
      comment,
      date: new Date()
    };

    await review.save();
    await review.populate('userId', 'name profileImage');
    await review.populate('reply.userId', 'name profileImage');

    res.json({
      message: 'Reply added successfully',
      review
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Failed to add reply' });
  }
});

// Get user's reviews
router.get('/user/me', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ userId, isActive: true })
      .populate('targetId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments({ userId, isActive: true });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      }
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Failed to fetch user reviews' });
  }
});

module.exports = router;
