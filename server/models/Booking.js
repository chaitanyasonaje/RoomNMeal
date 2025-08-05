const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'wallet', 'cash'],
    default: 'razorpay'
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  additionalServices: {
    meals: {
      included: { type: Boolean, default: false },
      mealTypes: [String],
      price: Number
    },
    laundry: {
      included: { type: Boolean, default: false },
      price: Number
    },
    tea: {
      included: { type: Boolean, default: false },
      price: Number
    }
  },
  specialRequests: String,
  cancellationReason: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  ratings: {
    room: { type: Number, min: 1, max: 5 },
    host: { type: Number, min: 1, max: 5 },
    services: { type: Number, min: 1, max: 5 }
  },
  reviews: {
    room: { comment: String, date: Date },
    host: { comment: String, date: Date },
    services: { comment: String, date: Date }
  },
  documents: [{
    name: String,
    url: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

bookingSchema.methods.calculateDuration = function() {
  const checkIn = new Date(this.checkIn);
  const checkOut = new Date(this.checkOut);
  const diffTime = checkOut - checkIn;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

bookingSchema.methods.calculateRefundAmount = function() {
  if (this.status === 'cancelled') {
    const today = new Date();
    const checkIn = new Date(this.checkIn);
    const daysUntilCheckIn = Math.ceil((checkIn - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilCheckIn > 7) {
      return this.paidAmount * 0.8; // 80% refund
    } else if (daysUntilCheckIn > 3) {
      return this.paidAmount * 0.5; // 50% refund
    } else {
      return 0; // No refund
    }
  }
  return 0;
};

bookingSchema.methods.confirmBooking = function() {
  this.status = 'confirmed';
  return this.save();
};

bookingSchema.methods.activateBooking = function() {
  this.status = 'active';
  return this.save();
};

bookingSchema.methods.completeBooking = function() {
  this.status = 'completed';
  return this.save();
};

bookingSchema.methods.cancelBooking = function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.refundAmount = this.calculateRefundAmount();
  return this.save();
};

bookingSchema.methods.addRating = function(type, rating, comment) {
  this.ratings[type] = rating;
  this.reviews[type] = {
    comment,
    date: new Date()
  };
  return this.save();
};

module.exports = mongoose.model('Booking', bookingSchema); 