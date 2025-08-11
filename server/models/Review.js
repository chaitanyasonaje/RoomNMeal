const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetModel: {
    type: String,
    enum: ['Room', 'MessPlan', 'User'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  title: {
    type: String,
    maxlength: 100,
    required: true
  },
  comment: {
    type: String,
    maxlength: 1000,
    required: true
  },
  images: [{
    type: String
  }],
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reply: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ targetId: 1, targetModel: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful.length;
});

// Method to check if user has already marked as helpful
reviewSchema.methods.isHelpfulByUser = function(userId) {
  return this.helpful.includes(userId);
};

// Method to toggle helpful status
reviewSchema.methods.toggleHelpful = function(userId) {
  const index = this.helpful.indexOf(userId);
  if (index > -1) {
    this.helpful.splice(index, 1);
  } else {
    this.helpful.push(userId);
  }
  return this.save();
};

module.exports = mongoose.model('Review', reviewSchema);
