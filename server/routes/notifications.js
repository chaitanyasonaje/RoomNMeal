const express = require('express');
const { auth } = require('../middlewares/auth');
const Notification = require('../models/Notification');
const NotificationService = require('../utils/notificationService');

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      category,
      isRead,
      isArchived = false
    } = req.query;

    const result = await NotificationService.getUserNotifications(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
      isArchived: isArchived === 'true'
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await NotificationService.getUnreadCount(userId);
    
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Failed to fetch unread count' });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await NotificationService.markAsRead(id, userId);
    
    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await NotificationService.markAllAsRead(userId);
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read' });
  }
});

// Archive notification
router.put('/:id/archive', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await NotificationService.archive(id, userId);
    
    res.json({
      message: 'Notification archived',
      notification
    });
  } catch (error) {
    console.error('Error archiving notification:', error);
    res.status(500).json({ message: 'Failed to archive notification' });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }

    await notification.deleteOne();
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

// Get notification preferences (placeholder)
router.get('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user preferences from user model
    const user = await require('../models/User').findById(userId);
    
    res.json({
      preferences: user.preferences?.notifications || {
        email: true,
        sms: true,
        push: true
      }
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ message: 'Failed to fetch notification preferences' });
  }
});

// Update notification preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, sms, push } = req.body;

    const user = await require('../models/User').findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update preferences
    if (!user.preferences) user.preferences = {};
    if (!user.preferences.notifications) user.preferences.notifications = {};
    
    if (email !== undefined) user.preferences.notifications.email = email;
    if (sms !== undefined) user.preferences.notifications.sms = sms;
    if (push !== undefined) user.preferences.notifications.push = push;

    await user.save();
    
    res.json({
      message: 'Notification preferences updated',
      preferences: user.preferences.notifications
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ message: 'Failed to update notification preferences' });
  }
});

// Admin: Create system announcement
router.post('/system-announcement', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create system announcements' });
    }

    const { title, message, recipientIds, priority = 'medium' } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    let targetRecipients = recipientIds;

    // If no specific recipients, send to all active users
    if (!targetRecipients || targetRecipients.length === 0) {
      const allUsers = await require('../models/User').find({ isActive: true }).select('_id');
      targetRecipients = allUsers.map(user => user._id);
    }

    const notifications = await NotificationService.createSystemAnnouncement(
      title,
      message,
      targetRecipients,
      priority
    );

    res.status(201).json({
      message: 'System announcement created successfully',
      notificationsCount: notifications.length
    });
  } catch (error) {
    console.error('Error creating system announcement:', error);
    res.status(500).json({ message: 'Failed to create system announcement' });
  }
});

// Admin: Get all notifications (for monitoring)
router.get('/admin/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can access this endpoint' });
    }

    const {
      page = 1,
      limit = 50,
      category,
      type,
      priority,
      isRead,
      startDate,
      endDate
    } = req.query;

    // Build query
    const query = {};
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (priority) query.priority = priority;
    if (isRead !== undefined) query.isRead = isRead === 'true';
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const notifications = await Notification.find(query)
      .populate('recipient', 'name email role')
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Notification.countDocuments(query);

    // Get statistics
    const stats = await Notification.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          byCategory: { $push: '$category' },
          byPriority: { $push: '$priority' }
        }
      }
    ]);

    res.json({
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total
      },
      stats: stats[0] || {
        total: 0,
        unread: 0,
        byCategory: [],
        byPriority: []
      }
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({ message: 'Failed to fetch admin notifications' });
  }
});

// Admin: Cleanup expired notifications
router.post('/admin/cleanup', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can perform cleanup' });
    }

    const deletedCount = await NotificationService.cleanupExpired();
    
    res.json({
      message: 'Cleanup completed',
      deletedCount
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({ message: 'Failed to perform cleanup' });
  }
});

// Test notification endpoint (for development)
router.post('/test', auth, async (req, res) => {
  try {
    const { type, title, message, priority = 'medium' } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({ message: 'Type, title, and message are required' });
    }

    const notification = await NotificationService.create({
      recipient: req.user.id,
      type,
      title,
      message,
      priority,
      category: 'system',
      actionRequired: false
    });

    res.status(201).json({
      message: 'Test notification created',
      notification
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({ message: 'Failed to create test notification' });
  }
});

module.exports = router;
