const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const { auth } = require('../middlewares/auth');

const router = express.Router();
const { io } = require('../server');

// Get user conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    // Get all users except the current user
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('name email profileImage isOnline')
      .sort({ name: 1 });

    // Get last message for each conversation
    const conversations = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await ChatMessage.findOne({
          $or: [
            { sender: req.user._id, receiver: user._id },
            { sender: user._id, receiver: req.user._id }
          ]
        })
        .sort({ createdAt: -1 })
        .select('message createdAt');

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          isOnline: user.isOnline || false,
          lastMessage: lastMessage?.message || null,
          lastMessageTime: lastMessage?.createdAt || null
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      if (!a.lastMessageTime && !b.lastMessageTime) return 0;
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get chat messages between two users
router.get('/messages/:userId', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name profileImage')
    .populate('receiver', 'name profileImage')
    .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get chat messages between two users (legacy route)
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name profileImage')
    .populate('receiver', 'name profileImage')
    .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/send', auth, async (req, res) => {
  try {
    const { receiverId, message, messageType = 'text' } = req.body;

    const chatMessage = new ChatMessage({
      sender: req.user._id,
      receiver: receiverId,
      message,
      messageType
    });

    await chatMessage.save();

    const populatedMessage = await ChatMessage.findById(chatMessage._id)
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    // Emit real-time events to both sender and receiver rooms
    try {
      io.to(String(receiverId)).emit('receiveMessage', populatedMessage);
      io.to(String(req.user._id)).emit('messageDelivered', populatedMessage);
    } catch (e) {
      console.error('Socket emit error:', e.message);
    }

    res.status(201).json({ message: 'Message sent', chatMessage: populatedMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:userId', auth, async (req, res) => {
  try {
    await ChatMessage.updateMany(
      {
        sender: req.params.userId,
        receiver: req.user._id,
        isRead: false
      },
      { isRead: true, readAt: new Date() }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 