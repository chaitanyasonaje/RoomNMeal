const mongoose = require('mongoose');

const serviceOrderSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderDetails: {
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit: String, // kg, items, hours, etc.
    specialInstructions: String,
    requirements: [String], // what customer needs to provide
    pickupAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    deliveryAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    scheduledDate: Date,
    scheduledTime: String
  },
  pricing: {
    unitPrice: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['wallet', 'razorpay', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  timeline: {
    orderedAt: {
      type: Date,
      default: Date.now
    },
    confirmedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    refundedAt: Date
  },
  communication: {
    messages: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      message: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      type: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
      }
    }],
    lastMessageAt: Date
  },
  rating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['customer', 'provider', 'system'],
      default: 'customer'
    },
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
serviceOrderSchema.index({ customer: 1, status: 1 });
serviceOrderSchema.index({ provider: 1, status: 1 });
serviceOrderSchema.index({ service: 1 });
serviceOrderSchema.index({ status: 1, createdAt: -1 });

// Virtual for order duration
serviceOrderSchema.virtual('duration').get(function() {
  if (this.timeline.startedAt && this.timeline.completedAt) {
    return this.timeline.completedAt - this.timeline.startedAt;
  }
  return null;
});

// Method to update status
serviceOrderSchema.methods.updateStatus = function(newStatus, userId) {
  this.status = newStatus;
  
  // Update timeline based on status
  switch (newStatus) {
    case 'confirmed':
      this.timeline.confirmedAt = new Date();
      break;
    case 'in_progress':
      this.timeline.startedAt = new Date();
      break;
    case 'completed':
      this.timeline.completedAt = new Date();
      break;
    case 'cancelled':
      this.timeline.cancelledAt = new Date();
      break;
    case 'refunded':
      this.timeline.refundedAt = new Date();
      break;
  }
  
  return this.save();
};

// Method to add message
serviceOrderSchema.methods.addMessage = function(senderId, message, type = 'text') {
  this.communication.messages.push({
    sender: senderId,
    message,
    type,
    timestamp: new Date()
  });
  this.communication.lastMessageAt = new Date();
  return this.save();
};

// Method to calculate total price
serviceOrderSchema.methods.calculateTotal = function() {
  const subtotal = this.pricing.unitPrice * this.pricing.quantity;
  const total = subtotal + this.pricing.tax - this.pricing.discount;
  
  this.pricing.subtotal = subtotal;
  this.pricing.total = total;
  
  return this.save();
};

// Pre-save middleware to calculate pricing
serviceOrderSchema.pre('save', function(next) {
  if (this.isModified('pricing.unitPrice') || this.isModified('pricing.quantity')) {
    this.calculateTotal();
  }
  next();
});

module.exports = mongoose.model('ServiceOrder', serviceOrderSchema);
