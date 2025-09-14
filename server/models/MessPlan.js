const mongoose = require('mongoose');

const messPlanSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  city: {
    id: String,
    name: String,
    state: String
  },
  planName: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  planType: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: true
  },
  duration: {
    type: Number,
    required: true // days
  },
  price: {
    type: Number,
    required: true
  },
  mealTypes: [{
    type: String,
    enum: ['breakfast', 'lunch', 'dinner']
  }],
  cuisine: [String], // North Indian, South Indian, Jain, etc.
  dietaryOptions: [String], // Veg, Non-Veg, Jain, etc.
  menu: {
    breakfast: [String],
    lunch: [String],
    dinner: [String]
  },
  mealTimings: {
    breakfast: String,
    lunch: String,
    dinner: String
  },
  capacity: {
    type: Number,
    required: true
  },
  currentSubscribers: {
    type: Number,
    default: 0
  },
  hygieneRating: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  images: [String],
  documents: [{
    name: String,
    url: String
  }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  features: [String], // Home-cooked, Fresh ingredients, etc.
  cancellationPolicy: {
    type: String,
    default: 'No refund after subscription starts'
  }
}, {
  timestamps: true
});

messPlanSchema.virtual('availableSlots').get(function() {
  return this.capacity - this.currentSubscribers;
});

messPlanSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = totalRating / this.reviews.length;
    this.ratings.count = this.reviews.length;
  }
  return this.save();
};

messPlanSchema.methods.addSubscriber = function() {
  if (this.currentSubscribers < this.capacity) {
    this.currentSubscribers += 1;
    return this.save();
  }
  throw new Error('Mess plan is at full capacity');
};

messPlanSchema.methods.removeSubscriber = function() {
  if (this.currentSubscribers > 0) {
    this.currentSubscribers -= 1;
    return this.save();
  }
};

module.exports = mongoose.model('MessPlan', messPlanSchema); 