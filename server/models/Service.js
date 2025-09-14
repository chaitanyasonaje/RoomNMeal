const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['laundry', 'wifi', 'tiffin', 'housekeeping', 'tutor', 'bike-rental', 'cleaning', 'food', 'transport', 'maintenance', 'other'],
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  contact: {
    type: String,
    required: true
  },
  priceType: {
    type: String,
    enum: ['per_item', 'per_kg', 'per_meal', 'per_trip', 'per_hour', 'fixed'],
    default: 'fixed'
  },
  duration: {
    type: String,
    required: true
  },
  availability: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timeSlots: [{
      start: String,
      end: String
    }],
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    serviceRadius: Number // in kilometers
  },
  features: [{
    name: String,
    description: String,
    included: Boolean
  }],
  images: [String],
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  maxOrders: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  currentOrders: {
    type: Number,
    default: 0
  },
  tags: [String],
  category: {
    type: String,
    required: true
  },
  subcategory: String,
  requirements: [String], // what customer needs to provide
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'moderate'
  },
  refundPolicy: String,
  terms: String
}, {
  timestamps: true
});

// Indexes for efficient queries
serviceSchema.index({ type: 1, isActive: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ location: '2dsphere' });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ isFeatured: 1, isActive: 1 });

// Virtual for availability status
serviceSchema.virtual('isAvailableNow').get(function() {
  if (!this.availability.isAvailable) return false;
  
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  
  const isDayAvailable = this.availability.days.includes(day);
  const isTimeAvailable = this.availability.timeSlots.some(slot => 
    time >= slot.start && time <= slot.end
  );
  
  return isDayAvailable && isTimeAvailable;
});

// Method to check if service can accept more orders
serviceSchema.methods.canAcceptOrder = function() {
  if (this.maxOrders === 0) return true;
  return this.currentOrders < this.maxOrders;
};

// Method to update rating
serviceSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.totalReviews + newRating;
  this.rating.totalReviews += 1;
  this.rating.average = totalRating / this.rating.totalReviews;
  return this.save();
};

// Method to increment/decrement order count
serviceSchema.methods.updateOrderCount = function(increment = true) {
  if (increment) {
    this.currentOrders += 1;
  } else {
    this.currentOrders = Math.max(0, this.currentOrders - 1);
  }
  return this.save();
};

module.exports = mongoose.model('Service', serviceSchema);
