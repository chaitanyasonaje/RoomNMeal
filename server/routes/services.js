const express = require('express');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Laundry services
router.get('/laundry', async (req, res) => {
  try {
    // Placeholder for laundry services
    res.json({ message: 'Laundry services endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Tea services
router.get('/tea', async (req, res) => {
  try {
    // Placeholder for tea services
    res.json({ message: 'Tea services endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 