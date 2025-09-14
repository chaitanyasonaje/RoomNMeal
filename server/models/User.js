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
    minlength: 8,
    validate: {
      validator: function(password) {
        // Password policy: minimum 8 characters, must include uppercase, lowercase, number, and special symbol
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    }
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
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpiry: {
    type: Date,
    default: undefined
  },
  // OTP fields for email verification
  emailOTP: {
    type: String,
    default: undefined
  },
  emailOTPExpiry: {
    type: Date,
    default: undefined
  },
  // OTP fields for phone verification
  phoneOTP: {
    type: String,
    default: undefined
  },
  phoneOTPExpiry: {
    type: Date,
    default: undefined
  },
  // OTP fields for password reset
  resetOTP: {
    type: String,
    default: undefined
  },
  resetOTPExpiry: {
    type: Date,
    default: undefined
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

// Generate OTP for email verification
userSchema.methods.generateEmailOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.emailOTP = otp;
  this.emailOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  return otp;
};

// Generate OTP for phone verification
userSchema.methods.generatePhoneOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.phoneOTP = otp;
  this.phoneOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  return otp;
};

// Generate OTP for password reset
userSchema.methods.generateResetOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.resetOTP = otp;
  this.resetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  return otp;
};

// Verify email OTP
userSchema.methods.verifyEmailOTP = function(otp) {
  return this.emailOTP === otp && this.emailOTPExpiry > Date.now();
};

// Verify phone OTP
userSchema.methods.verifyPhoneOTP = function(otp) {
  return this.phoneOTP === otp && this.phoneOTPExpiry > Date.now();
};

// Verify reset OTP
userSchema.methods.verifyResetOTP = function(otp) {
  return this.resetOTP === otp && this.resetOTPExpiry > Date.now();
};

// Clear OTPs
userSchema.methods.clearOTPs = function() {
  this.emailOTP = undefined;
  this.emailOTPExpiry = undefined;
  this.phoneOTP = undefined;
  this.phoneOTPExpiry = undefined;
  this.resetOTP = undefined;
  this.resetOTPExpiry = undefined;
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 