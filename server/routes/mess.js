const express = require('express');
const MessPlan = require('../models/MessPlan');
const MessSubscription = require('../models/MessSubscription');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Get all mess plans
router.get('/plans', async (req, res) => {
  try {
    const { city, state, minPrice, maxPrice, planType, cuisine, dietaryOptions } = req.query;
    
    let query = { isActive: true };

    // Filter by city
    if (city) {
      query['city.id'] = city;
    }

    // Filter by state
    if (state) {
      query['city.state'] = state;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Filter by plan type
    if (planType) {
      query.planType = planType;
    }

    // Filter by cuisine
    if (cuisine) {
      const cuisineArray = cuisine.split(',');
      query.cuisine = { $in: cuisineArray };
    }

    // Filter by dietary options
    if (dietaryOptions) {
      const dietaryArray = dietaryOptions.split(',');
      query.dietaryOptions = { $in: dietaryArray };
    }

    const plans = await MessPlan.find(query)
      .populate('provider', 'name phone messDetails')
      .sort({ createdAt: -1 });

    res.json({ plans });
  } catch (error) {
    console.error('Error fetching mess plans:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single mess plan
router.get('/plans/:id', async (req, res) => {
  try {
    const plan = await MessPlan.findById(req.params.id)
      .populate('provider', 'name phone messDetails');

    if (!plan) {
      return res.status(404).json({ message: 'Mess plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create mess plan (Mess Provider only)
router.post('/plans', auth, requireRole(['messProvider']), async (req, res) => {
  try {
    const plan = new MessPlan({
      ...req.body,
      provider: req.user._id
    });

    await plan.save();
    res.status(201).json({ message: 'Mess plan created', plan });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Subscribe to mess plan
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { planId, startDate, endDate, mealPreferences } = req.body;

    const plan = await MessPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Mess plan not found' });
    }

    const subscription = new MessSubscription({
      student: req.user._id,
      messPlan: planId,
      startDate,
      endDate,
      totalAmount: plan.price,
      mealPreferences
    });

    await subscription.save();
    await plan.addSubscriber();

    res.status(201).json({ message: 'Subscribed successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's subscriptions
router.get('/my-subscriptions', auth, async (req, res) => {
  try {
    const subscriptions = await MessSubscription.find({ student: req.user._id })
      .populate('messPlan')
      .sort({ createdAt: -1 });

    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get plans for the logged-in mess provider
router.get('/provider/my-plans', auth, requireRole(['messProvider']), async (req, res) => {
  try {
    const plans = await MessPlan.find({ provider: req.user._id, isActive: true })
      .sort({ createdAt: -1 });
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete mess plan (Provider only)
router.delete('/plans/:id', auth, requireRole(['messProvider']), async (req, res) => {
  try {
    const plan = await MessPlan.findOneAndDelete({ _id: req.params.id, provider: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'Mess plan not found or not authorized' });
    }
    res.json({ message: 'Mess plan deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 