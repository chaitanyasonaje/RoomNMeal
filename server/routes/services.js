const express = require('express');
const { auth } = require('../middlewares/auth');
const Service = require('../models/Service');
const ServiceOrder = require('../models/ServiceOrder');
const User = require('../models/User');

const router = express.Router();

// Get all services with filters
router.get('/', async (req, res) => {
  try {
    const {
      type,
      category,
      location, // city name
      city,
      state,
      lat,
      lng,
      radius,
      priceMin,
      priceMax,
      rating,
      isAvailable,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true, isVerified: true };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (rating) query['rating.average'] = { $gte: parseFloat(rating) };
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }
    if (isAvailable === 'true') query['availability.isAvailable'] = true;

    // Location filters
    if (city || location) {
      query['location.city'] = new RegExp(`^${city || location}$`, 'i');
    }
    if (state) {
      query['location.state'] = new RegExp(`^${state}$`, 'i');
    }
    // Geo radius filter if lat/lng provided and schema has coordinates
    if (lat && lng && radius) {
      const r = parseFloat(radius) / 6378.1; // radius in radians (km/EarthRadius)
      query['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [ [ parseFloat(lng), parseFloat(lat) ], r ]
        }
      };
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'price':
        sortOptions = { price: sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'popularity':
        sortOptions = { 'rating.totalReviews': sortOrder === 'desc' ? -1 : 1 };
        break;
      default:
        sortOptions = { createdAt: sortOrder === 'desc' ? -1 : 1 };
    }

    const services = await Service.find(query)
      .populate('provider', 'name profileImage isVerified')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Service.countDocuments(query);

    // Get service categories for filters
    const categories = await Service.distinct('category', { isActive: true });
    const types = await Service.distinct('type', { isActive: true });

    res.json({
      services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalServices: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        categories,
        types
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id)
      .populate('provider', 'name profileImage isVerified phone')
      .lean();

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get related services
    const relatedServices = await Service.find({
      _id: { $ne: id },
      type: service.type,
      isActive: true,
      isVerified: true
    })
      .populate('provider', 'name profileImage')
      .limit(4)
      .lean();

    res.json({
      service,
      relatedServices
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Failed to fetch service' });
  }
});

// Create new service (for providers)
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user is a service provider
    if (!['host', 'messProvider', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only service providers can create services' });
    }

    const {
      name,
      type,
      description,
      price,
      priceType,
      duration,
      availability,
      location,
      features,
      category,
      subcategory,
      requirements,
      cancellationPolicy,
      refundPolicy,
      terms,
      tags
    } = req.body;

    // Validate required fields
    if (!name || !type || !description || !price || !duration || !availability || !location || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const service = new Service({
      name,
      type,
      description,
      price,
      priceType,
      duration,
      availability,
      location,
      features: features || [],
      category,
      subcategory,
      requirements: requirements || [],
      cancellationPolicy,
      refundPolicy,
      terms,
      tags: tags || [],
      provider: userId
    });

    await service.save();
    await service.populate('provider', 'name profileImage');

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Failed to create service' });
  }
});

// Update service
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user owns the service or is admin
    if (service.provider.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this service' });
    }

    // Update fields
    const updateFields = [
      'name', 'description', 'price', 'priceType', 'duration', 'availability',
      'location', 'features', 'category', 'subcategory', 'requirements',
      'cancellationPolicy', 'refundPolicy', 'terms', 'tags'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    await service.save();
    await service.populate('provider', 'name profileImage');

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Failed to update service' });
  }
});

// Delete service
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user owns the service or is admin
    if (service.provider.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    // Soft delete
    service.isActive = false;
    await service.save();

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Failed to delete service' });
  }
});

// Get services by provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const services = await Service.find({
      provider: providerId,
      isActive: true
    })
      .populate('provider', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Service.countDocuments({
      provider: providerId,
      isActive: true
    });

    res.json({
      services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalServices: total
      }
    });
  } catch (error) {
    console.error('Error fetching provider services:', error);
    res.status(500).json({ message: 'Failed to fetch provider services' });
  }
});

// Get my services (for logged-in providers)
router.get('/my-services', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const services = await Service.find({
      provider: userId,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Service.countDocuments({
      provider: userId,
      isActive: true
    });

    res.json({
      services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalServices: total
      }
    });
  } catch (error) {
    console.error('Error fetching my services:', error);
    res.status(500).json({ message: 'Failed to fetch my services' });
  }
});

// Book a service
router.post('/:id/book', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      quantity,
      unit,
      specialInstructions,
      requirements,
      pickupAddress,
      deliveryAddress,
      scheduledDate,
      scheduledTime,
      paymentMethod
    } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (!service.isActive) {
      return res.status(400).json({ message: 'Service is not available' });
    }

    if (!service.canAcceptOrder()) {
      return res.status(400).json({ message: 'Service is at maximum capacity' });
    }

    // Calculate pricing
    const unitPrice = service.price;
    const subtotal = unitPrice * quantity;
    const total = subtotal; // Add tax/discount logic here if needed

    const serviceOrder = new ServiceOrder({
      service: id,
      customer: userId,
      provider: service.provider,
      orderDetails: {
        quantity,
        unit,
        specialInstructions,
        requirements: requirements || [],
        pickupAddress,
        deliveryAddress,
        scheduledDate,
        scheduledTime
      },
      pricing: {
        unitPrice,
        quantity,
        subtotal,
        total,
        currency: 'INR'
      },
      payment: {
        method: paymentMethod || 'wallet'
      }
    });

    await serviceOrder.save();
    
    // Update service order count
    await service.updateOrderCount(true);

    // Populate references
    await serviceOrder.populate('service');
    await serviceOrder.populate('provider', 'name profileImage');

    res.status(201).json({
      message: 'Service booked successfully',
      order: serviceOrder
    });
  } catch (error) {
    console.error('Error booking service:', error);
    res.status(500).json({ message: 'Failed to book service' });
  }
});

// Get service orders for customer
router.get('/orders/my-orders', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { customer: userId, isActive: true };
    if (status) query.status = status;

    const orders = await ServiceOrder.find(query)
      .populate('service', 'name type images')
      .populate('provider', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await ServiceOrder.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get service orders for provider
router.get('/orders/provider-orders', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { provider: userId, isActive: true };
    if (status) query.status = status;

    const orders = await ServiceOrder.find(query)
      .populate('service', 'name type images')
      .populate('customer', 'name profileImage phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await ServiceOrder.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Error fetching provider orders:', error);
    res.status(500).json({ message: 'Failed to fetch provider orders' });
  }
});

// Update order status
router.put('/orders/:orderId/status', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, reason } = req.body;
    const userId = req.user.id;

    const order = await ServiceOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user can update status
    if (order.provider.toString() !== userId && order.customer.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
      refunded: []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    // Update status
    await order.updateStatus(status, userId);

    // Handle cancellation
    if (status === 'cancelled') {
      order.cancellation.reason = reason;
      order.cancellation.cancelledBy = order.provider.toString() === userId ? 'provider' : 'customer';
      
      // Update service order count
      const service = await Service.findById(order.service);
      if (service) {
        await service.updateOrderCount(false);
      }
    }

    await order.save();
    await order.populate('service', 'name type');
    await order.populate('provider', 'name profileImage');
    await order.populate('customer', 'name profileImage');

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Add message to order
router.post('/orders/:orderId/message', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { message, type = 'text' } = req.body;
    const userId = req.user.id;

    const order = await ServiceOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is part of the order
    if (order.customer.toString() !== userId && order.provider.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to message this order' });
    }

    await order.addMessage(userId, message, type);
    await order.populate('service', 'name type');
    await order.populate('provider', 'name profileImage');
    await order.populate('customer', 'name profileImage');

    res.json({
      message: 'Message added successfully',
      order
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Failed to add message' });
  }
});

// Rate completed service
router.post('/orders/:orderId/rate', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid rating is required' });
    }

    const order = await ServiceOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the customer
    if (order.customer.toString() !== userId) {
      return res.status(403).json({ message: 'Only customers can rate services' });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed services' });
    }

    // Check if already rated
    if (order.rating.rating) {
      return res.status(400).json({ message: 'Service already rated' });
    }

    // Add rating
    order.rating = {
      rating,
      comment,
      createdAt: new Date()
    };

    await order.save();

    // Update service rating
    const service = await Service.findById(order.service);
    if (service) {
      await service.updateRating(rating);
    }

    res.json({
      message: 'Service rated successfully',
      order
    });
  } catch (error) {
    console.error('Error rating service:', error);
    res.status(500).json({ message: 'Failed to rate service' });
  }
});

module.exports = router;
