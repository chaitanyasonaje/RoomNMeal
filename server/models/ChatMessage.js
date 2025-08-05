const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'location'],
    default: 'text'
  },
  fileUrl: String,
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  relatedBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  relatedSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessSubscription'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatMessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
chatMessageSchema.index({ receiver: 1, isRead: 1 });

chatMessageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 