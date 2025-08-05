const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['student', 'host', 'messProvider', 'admin'],
    default: 'student'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  collegeId: {
    type: String,
    default: ''
  },
  collegeName: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }]
  },
  // Student specific fields
  studentDetails: {
    college: String,
    course: String,
    year: Number,
    studentId: String,
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  // Host specific fields
  hostDetails: {
    propertyType: {
      type: String,
      enum: ['PG', 'Hostel', 'Apartment', 'House']
    },
    totalRooms: Number,
    availableRooms: Number,
    amenities: [String],
    rules: [String],
    documents: [{
      name: String,
      url: String
    }]
  },
  // Mess Provider specific fields
  messDetails: {
    messName: String,
    cuisine: [String],
    mealTypes: [String],
    capacity: Number,
    hygieneRating: {
      type: Number,
      default: 0
    },
    documents: [{
      name: String,
      url: String
    }],
    kitchenPhotos: [String]
  },
  // Common fields
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    dietaryRestrictions: [String],
    mealTimings: {
      breakfast: String,
      lunch: String,
      dinner: String
    }
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate referral code
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = this._id.toString().slice(-8).toUpperCase();
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get user profile (without sensitive data)
userSchema.methods.getProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Update wallet balance
userSchema.methods.updateWallet = function(amount, transactionId) {
  this.wallet.balance += amount;
  if (transactionId) {
    this.wallet.transactions.push(transactionId);
  }
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 