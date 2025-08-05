const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  propertyType: {
    type: String,
    enum: ['PG', 'Hostel', 'Apartment', 'House'],
    required: true
  },
  roomType: {
    type: String,
    enum: ['Single', 'Double', 'Triple', 'Quad'],
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  nearbyColleges: [{
    name: String,
    distance: Number
  }],
  amenities: [String],
  rules: [String],
  images: [String],
  availability: {
    isAvailable: { type: Boolean, default: true },
    totalRooms: { type: Number, required: true },
    occupiedRooms: { type: Number, default: 0 }
  },
  mealOptions: {
    hasMeals: { type: Boolean, default: false },
    mealTypes: [String],
    mealPrice: {
      breakfast: Number,
      lunch: Number,
      dinner: Number
    }
  },
  additionalServices: {
    laundry: { available: Boolean, price: Number },
    tea: { available: Boolean, price: Number }
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    totalRatingScore: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

roomSchema.virtual('availableRooms').get(function() {
  return this.availability.totalRooms - this.availability.occupiedRooms;
});

roomSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    this.ratings.totalRatingScore = 0;
    this.ratings.totalRatings = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = totalRating / this.reviews.length;
    this.ratings.count = this.reviews.length;
    this.ratings.totalRatingScore = totalRating;
    this.ratings.totalRatings = this.reviews.length;
  }
  return this.save();
};

roomSchema.methods.addReview = function(userId, rating, comment) {
  // Remove existing review by this user
  this.reviews = this.reviews.filter(review => review.user.toString() !== userId.toString());
  
  // Add new review
  this.reviews.push({
    user: userId,
    rating,
    comment,
    date: new Date()
  });
  
  return this.updateRating();
};

roomSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

roomSchema.methods.toggleFavorite = function(userId) {
  const index = this.favorites.indexOf(userId);
  if (index > -1) {
    this.favorites.splice(index, 1);
  } else {
    this.favorites.push(userId);
  }
  return this.save();
};

roomSchema.methods.isFavoritedBy = function(userId) {
  return this.favorites.includes(userId);
};

roomSchema.methods.updateAvailability = function(booked = true) {
  if (booked) {
    this.availability.occupiedRooms += 1;
  } else {
    this.availability.occupiedRooms = Math.max(0, this.availability.occupiedRooms - 1);
  }
  
  this.availability.isAvailable = this.availability.occupiedRooms < this.availability.totalRooms;
  return this.save();
};

module.exports = mongoose.model('Room', roomSchema); 