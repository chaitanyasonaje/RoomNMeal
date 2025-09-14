const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // User information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Payment details
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentId: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  signature: {
    type: String,
    required: true
  },
  
  // Transaction details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    required: true
  },
  
  // Item being paid for
  itemType: {
    type: String,
    enum: ['mess_plan', 'room_booking', 'service', 'subscription'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  
  // Payment status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Razorpay details
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  
  // Additional details
  receipt: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  
  // Timestamps
  paidAt: {
    type: Date,
    default: null
  },
  refundedAt: {
    type: Date,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  
  // Webhook data
  webhookData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Customer details
  customerDetails: {
    name: String,
    email: String,
    phone: String
  },
  
  // Billing address
  billingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ itemType: 1, itemId: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount / 100);
});

// Virtual for payment status display
paymentSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
  };
  return statusMap[this.status] || this.status;
});

// Method to check if payment is successful
paymentSchema.methods.isSuccessful = function() {
  return this.status === 'completed';
};

// Method to check if payment is pending
paymentSchema.methods.isPending = function() {
  return this.status === 'pending';
};

// Method to check if payment is failed
paymentSchema.methods.isFailed = function() {
  return this.status === 'failed' || this.status === 'cancelled';
};

// Static method to get payment statistics
paymentSchema.statics.getStats = async function(userId = null, itemType = null, status = null) {
  const match = {};
  if (userId) match.userId = userId;
  if (itemType) match.itemType = itemType;
  if (status) match.status = status;

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalCount: { $sum: 1 },
        completedAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0]
          }
        },
        completedCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        },
        pendingCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
          }
        },
        failedCount: {
          $sum: {
            $cond: [{ $in: ['$status', ['failed', 'cancelled']] }, 1, 0]
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalAmount: 0,
    totalCount: 0,
    completedAmount: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0
  };
};

// Pre-save middleware to generate receipt if not provided
paymentSchema.pre('save', function(next) {
  if (!this.receipt) {
    this.receipt = `receipt_${this.itemType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
