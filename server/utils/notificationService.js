const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Create a single notification
  static async create(data) {
    try {
      const notification = await Notification.createNotification(data);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create multiple notifications
  static async createMultiple(notifications) {
    try {
      const createdNotifications = await Notification.createMultiple(notifications);
      return createdNotifications;
    } catch (error) {
      console.error('Error creating multiple notifications:', error);
      throw error;
    }
  }

  // Create booking notifications
  static async createBookingNotification(booking, type, recipientId, senderId = null) {
    const notificationData = {
      recipient: recipientId,
      sender: senderId,
      category: 'booking',
      actionRequired: false
    };

    switch (type) {
      case 'created':
        notificationData.type = 'booking_created';
        notificationData.title = 'New Booking Request';
        notificationData.message = `You have a new booking request for ${booking.room?.title || 'your room'}`;
        notificationData.priority = 'medium';
        notificationData.data = { bookingId: booking._id, roomId: booking.room };
        break;
      
      case 'confirmed':
        notificationData.type = 'booking_confirmed';
        notificationData.title = 'Booking Confirmed!';
        notificationData.message = `Your booking for ${booking.room?.title || 'the room'} has been confirmed`;
        notificationData.priority = 'high';
        notificationData.data = { bookingId: booking._id, roomId: booking.room };
        break;
      
      case 'cancelled':
        notificationData.type = 'booking_cancelled';
        notificationData.title = 'Booking Cancelled';
        notificationData.message = `Your booking for ${booking.room?.title || 'the room'} has been cancelled`;
        notificationData.priority = 'medium';
        notificationData.data = { bookingId: booking._id, roomId: booking.room };
        break;
      
      case 'completed':
        notificationData.type = 'booking_completed';
        notificationData.title = 'Booking Completed';
        notificationData.message = `Your stay at ${booking.room?.title || 'the room'} has been completed`;
        notificationData.priority = 'low';
        notificationData.data = { bookingId: booking._id, roomId: booking.room };
        break;
    }

    return await this.create(notificationData);
  }

  // Create mess subscription notifications
  static async createMessNotification(subscription, type, recipientId) {
    const notificationData = {
      recipient: recipientId,
      category: 'mess',
      actionRequired: false
    };

    switch (type) {
      case 'subscribed':
        notificationData.type = 'mess_subscription';
        notificationData.title = 'Mess Subscription Active';
        notificationData.message = `Your subscription to ${subscription.messPlan?.planName || 'mess plan'} is now active`;
        notificationData.priority = 'medium';
        notificationData.data = { subscriptionId: subscription._id, messPlanId: subscription.messPlan };
        break;
      
      case 'cancelled':
        notificationData.type = 'mess_cancelled';
        notificationData.title = 'Mess Subscription Cancelled';
        notificationData.message = `Your subscription to ${subscription.messPlan?.planName || 'mess plan'} has been cancelled`;
        notificationData.priority = 'medium';
        notificationData.data = { subscriptionId: subscription._id, messPlanId: subscription.messPlan };
        break;
    }

    return await this.create(notificationData);
  }

  // Create service order notifications
  static async createServiceNotification(order, type, recipientId, senderId = null) {
    const notificationData = {
      recipient: recipientId,
      sender: senderId,
      category: 'service',
      actionRequired: false
    };

    switch (type) {
      case 'ordered':
        notificationData.type = 'service_order';
        notificationData.title = 'New Service Order';
        notificationData.message = `You have a new service order for ${order.service?.name || 'your service'}`;
        notificationData.priority = 'medium';
        notificationData.data = { orderId: order._id, serviceId: order.service };
        break;
      
      case 'confirmed':
        notificationData.type = 'service_confirmed';
        notificationData.title = 'Service Order Confirmed';
        notificationData.message = `Your service order for ${order.service?.name || 'the service'} has been confirmed`;
        notificationData.priority = 'medium';
        notificationData.data = { orderId: order._id, serviceId: order.service };
        break;
      
      case 'completed':
        notificationData.type = 'service_completed';
        notificationData.title = 'Service Completed';
        notificationData.message = `Your service order for ${order.service?.name || 'the service'} has been completed`;
        notificationData.priority = 'low';
        notificationData.data = { orderId: order._id, serviceId: order.service };
        break;
    }

    return await this.create(notificationData);
  }

  // Create payment notifications
  static async createPaymentNotification(transaction, type, recipientId) {
    const notificationData = {
      recipient: recipientId,
      category: 'payment',
      actionRequired: false
    };

    switch (type) {
      case 'success':
        notificationData.type = 'payment_success';
        notificationData.title = 'Payment Successful';
        notificationData.message = `Payment of ₹${transaction.amount} has been processed successfully`;
        notificationData.priority = 'high';
        notificationData.data = { transactionId: transaction._id, amount: transaction.amount };
        break;
      
      case 'failed':
        notificationData.type = 'payment_failed';
        notificationData.title = 'Payment Failed';
        notificationData.message = `Payment of ₹${transaction.amount} has failed. Please try again.`;
        notificationData.priority = 'urgent';
        notificationData.actionRequired = true;
        notificationData.actionUrl = '/payments';
        notificationData.actionText = 'Retry Payment';
        notificationData.data = { transactionId: transaction._id, amount: transaction.amount };
        break;
      
      case 'wallet_recharged':
        notificationData.type = 'wallet_recharged';
        notificationData.title = 'Wallet Recharged';
        notificationData.message = `Your wallet has been recharged with ₹${transaction.amount}`;
        notificationData.priority = 'medium';
        notificationData.data = { transactionId: transaction._id, amount: transaction.amount };
        break;
    }

    return await this.create(notificationData);
  }

  // Create review notifications
  static async createReviewNotification(review, recipientId, senderId) {
    const notificationData = {
      recipient: recipientId,
      sender: senderId,
      type: 'review_received',
      title: 'New Review Received',
      message: `You have received a ${review.rating}-star review`,
      category: 'communication',
      priority: 'medium',
      data: { reviewId: review._id, rating: review.rating, targetModel: review.targetModel }
    };

    return await this.create(notificationData);
  }

  // Create message notifications
  static async createMessageNotification(message, recipientId, senderId) {
    const notificationData = {
      recipient: recipientId,
      sender: senderId,
      type: 'message_received',
      title: 'New Message',
      message: `You have a new message from ${message.sender?.name || 'someone'}`,
      category: 'communication',
      priority: 'medium',
      data: { messageId: message._id, senderId: message.senderId }
    };

    return await this.create(notificationData);
  }

  // Create verification notifications
  static async createVerificationNotification(user, type, recipientId) {
    const notificationData = {
      recipient: recipientId,
      category: 'system',
      actionRequired: false
    };

    switch (type) {
      case 'approved':
        notificationData.type = 'verification_approved';
        notificationData.title = 'Account Verified!';
        notificationData.message = 'Your account has been verified successfully';
        notificationData.priority = 'high';
        break;
      
      case 'rejected':
        notificationData.type = 'verification_rejected';
        notificationData.title = 'Verification Rejected';
        notificationData.message = 'Your account verification has been rejected. Please check the requirements.';
        notificationData.priority = 'high';
        notificationData.actionRequired = true;
        notificationData.actionUrl = '/profile';
        notificationData.actionText = 'Update Profile';
        break;
    }

    return await this.create(notificationData);
  }

  // Create system announcements
  static async createSystemAnnouncement(title, message, recipientIds, priority = 'medium') {
    const notifications = recipientIds.map(recipientId => ({
      recipient: recipientId,
      type: 'system_announcement',
      title,
      message,
      category: 'system',
      priority,
      actionRequired: false
    }));

    return await this.createMultiple(notifications);
  }

  // Create reminder notifications
  static async createReminder(recipientId, title, message, reminderDate, data = {}) {
    const notificationData = {
      recipient: recipientId,
      type: 'reminder',
      title,
      message,
      category: 'system',
      priority: 'medium',
      actionRequired: false,
      data,
      expiresAt: reminderDate
    };

    return await this.create(notificationData);
  }

  // Create referral bonus notifications
  static async createReferralNotification(recipientId, referredUser, bonusAmount) {
    const notificationData = {
      recipient: recipientId,
      type: 'referral_bonus',
      title: 'Referral Bonus Earned!',
      message: `You earned ₹${bonusAmount} for referring ${referredUser.name}`,
      category: 'system',
      priority: 'high',
      actionRequired: false,
      data: { referredUserId: referredUser._id, bonusAmount }
    };

    return await this.create(notificationData);
  }

  // Get user notifications
  static async getUserNotifications(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      category,
      isRead,
      isArchived = false
    } = options;

    const query = { recipient: userId, isArchived };
    
    if (category) query.category = category;
    if (isRead !== undefined) query.isRead = isRead;

    const notifications = await Notification.find(query)
      .populate('sender', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Notification.countDocuments(query);

    return {
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total
      }
    };
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    
    if (!notification || notification.recipient.toString() !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    return await notification.markAsRead();
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    return await Notification.markAllAsRead(userId);
  }

  // Archive notification
  static async archive(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    
    if (!notification || notification.recipient.toString() !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    return await notification.archive();
  }

  // Get unread count
  static async getUnreadCount(userId) {
    return await Notification.getUnreadCount(userId);
  }

  // Delete expired notifications
  static async cleanupExpired() {
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    return result.deletedCount;
  }

  // Send push notification (placeholder for future implementation)
  static async sendPushNotification(userId, notification) {
    // TODO: Implement push notification logic
    // This could integrate with Firebase Cloud Messaging, OneSignal, etc.
    console.log(`Push notification would be sent to user ${userId}:`, notification.title);
  }

  // Send email notification (placeholder for future implementation)
  static async sendEmailNotification(userId, notification) {
    // TODO: Implement email notification logic
    // This could integrate with Nodemailer, SendGrid, etc.
    console.log(`Email notification would be sent to user ${userId}:`, notification.title);
  }

  // Send SMS notification (placeholder for future implementation)
  static async sendSMSNotification(userId, notification) {
    // TODO: Implement SMS notification logic
    // This could integrate with Twilio, AWS SNS, etc.
    console.log(`SMS notification would be sent to user ${userId}:`, notification.title);
  }
}

module.exports = NotificationService;
