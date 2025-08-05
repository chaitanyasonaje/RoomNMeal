const mongoose = require('mongoose');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const MessPlan = require('../models/MessPlan');
const MessSubscription = require('../models/MessSubscription');
const Transaction = require('../models/Transaction');
const ChatMessage = require('../models/ChatMessage');

const setupDatabase = async () => {
  try {
    console.log('Setting up database indexes and optimizations...');

    // User collection indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ phone: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ isVerified: 1 });
    await User.collection.createIndex({ isActive: 1 });
    await User.collection.createIndex({ referralCode: 1 }, { unique: true });
    await User.collection.createIndex({ 'wallet.balance': 1 });
    await User.collection.createIndex({ createdAt: -1 });

    // Room collection indexes
    await Room.collection.createIndex({ host: 1 });
    await Room.collection.createIndex({ location: 1 });
    await Room.collection.createIndex({ price: 1 });
    await Room.collection.createIndex({ isActive: 1 });
    await Room.collection.createIndex({ isAvailable: 1 });
    await Room.collection.createIndex({ amenities: 1 });
    await Room.collection.createIndex({ createdAt: -1 });
    await Room.collection.createIndex({
      location: 'text',
      title: 'text',
      description: 'text'
    });

    // Booking collection indexes
    await Booking.collection.createIndex({ student: 1 });
    await Booking.collection.createIndex({ room: 1 });
    await Booking.collection.createIndex({ host: 1 });
    await Booking.collection.createIndex({ status: 1 });
    await Booking.collection.createIndex({ paymentStatus: 1 });
    await Booking.collection.createIndex({ checkIn: 1 });
    await Booking.collection.createIndex({ checkOut: 1 });
    await Booking.collection.createIndex({ createdAt: -1 });
    await Booking.collection.createIndex({
      student: 1,
      status: 1
    });

    // MessPlan collection indexes
    await MessPlan.collection.createIndex({ provider: 1 });
    await MessPlan.collection.createIndex({ isActive: 1 });
    await MessPlan.collection.createIndex({ price: 1 });
    await MessPlan.collection.createIndex({ cuisine: 1 });
    await MessPlan.collection.createIndex({ createdAt: -1 });

    // MessSubscription collection indexes
    await MessSubscription.collection.createIndex({ student: 1 });
    await MessSubscription.collection.createIndex({ messPlan: 1 });
    await MessSubscription.collection.createIndex({ status: 1 });
    await MessSubscription.collection.createIndex({ paymentStatus: 1 });
    await MessSubscription.collection.createIndex({ startDate: 1 });
    await MessSubscription.collection.createIndex({ endDate: 1 });
    await MessSubscription.collection.createIndex({ createdAt: -1 });

    // Transaction collection indexes
    await Transaction.collection.createIndex({ user: 1 });
    await Transaction.collection.createIndex({ type: 1 });
    await Transaction.collection.createIndex({ status: 1 });
    await Transaction.collection.createIndex({ paymentMethod: 1 });
    await Transaction.collection.createIndex({ createdAt: -1 });
    await Transaction.collection.createIndex({
      user: 1,
      status: 1
    });
    await Transaction.collection.createIndex({
      razorpayOrderId: 1
    }, { sparse: true });
    await Transaction.collection.createIndex({
      razorpayPaymentId: 1
    }, { sparse: true });

    // ChatMessage collection indexes
    await ChatMessage.collection.createIndex({ sender: 1 });
    await ChatMessage.collection.createIndex({ receiver: 1 });
    await ChatMessage.collection.createIndex({ isRead: 1 });
    await ChatMessage.collection.createIndex({ createdAt: -1 });
    await ChatMessage.collection.createIndex({
      sender: 1,
      receiver: 1,
      createdAt: -1
    });
    await ChatMessage.collection.createIndex({
      receiver: 1,
      isRead: 1
    });

    console.log('✅ Database indexes created successfully');

    // Create sample admin user if no admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@roomnmeal.com',
        password: 'admin123', // Change this in production
        phone: '9999999999',
        role: 'admin',
        isVerified: true,
        isActive: true,
        referralCode: 'ADMIN001'
      });

      await adminUser.save();
      console.log('✅ Sample admin user created');
    }

    // Create sample data for testing (optional)
    if (process.env.NODE_ENV === 'development') {
      await createSampleData();
    }

    console.log('✅ Database setup completed successfully');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
};

const createSampleData = async () => {
  try {
    console.log('Creating sample data for development...');

    // Check if sample host already exists
    let host = await User.findOne({ email: 'host@roomnmeal.com' });
    if (!host) {
      host = new User({
        name: 'Sample Host',
        email: 'host@roomnmeal.com',
        password: 'host123',
        phone: '8888888888',
        role: 'host',
        isVerified: true,
        isActive: true,
        hostDetails: {
          propertyType: 'PG',
          totalRooms: 10,
          availableRooms: 5,
          amenities: ['WiFi', 'AC', 'Food'],
          rules: ['No smoking', 'No pets']
        }
      });
      await host.save();
      console.log('✅ Sample host created');
    } else {
      console.log('ℹ️ Sample host already exists');
    }

    // Check if sample mess provider already exists
    let messProvider = await User.findOne({ email: 'mess@roomnmeal.com' });
    if (!messProvider) {
      messProvider = new User({
        name: 'Sample Mess Provider',
        email: 'mess@roomnmeal.com',
        password: 'mess123',
        phone: '7777777777',
        role: 'messProvider',
        isVerified: true,
        isActive: true,
        messDetails: {
          messName: 'Sample Mess',
          cuisine: ['North Indian', 'South Indian'],
          mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
          capacity: 50,
          hygieneRating: 4.5
        }
      });
      await messProvider.save();
      console.log('✅ Sample mess provider created');
    } else {
      console.log('ℹ️ Sample mess provider already exists');
    }

    // Check if sample room already exists
    const existingRoom = await Room.findOne({ title: 'Sample Room' });
    if (!existingRoom && host) {
      const room = new Room({
        title: 'Sample Room',
        description: 'A comfortable room with all amenities',
        host: host._id,
        propertyType: 'PG',
        roomType: 'Single',
        rent: 5000,
        address: {
          street: 'Sample Street',
          city: 'Sample City',
          state: 'Sample State',
          pincode: '123456'
        },
        amenities: ['WiFi', 'AC', 'Attached Bathroom'],
        rules: ['No smoking', 'No pets'],
        images: [],
        availability: {
          isAvailable: true,
          totalRooms: 5,
          occupiedRooms: 0
        },
        isActive: true
      });
      await room.save();
      console.log('✅ Sample room created');
    } else {
      console.log('ℹ️ Sample room already exists or host not available');
    }

    // Check if sample mess plan already exists
    const existingMessPlan = await MessPlan.findOne({ name: 'Monthly Plan' });
    if (!existingMessPlan && messProvider) {
      const messPlan = new MessPlan({
        name: 'Monthly Plan',
        description: 'Complete monthly meal plan',
        provider: messProvider._id,
        price: 3000,
        duration: 30,
        mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
        cuisine: ['North Indian', 'South Indian'],
        isActive: true
      });
      await messPlan.save();
      console.log('✅ Sample mess plan created');
    } else {
      console.log('ℹ️ Sample mess plan already exists or provider not available');
    }

    console.log('✅ Sample data creation completed');
  } catch (error) {
    console.error('❌ Sample data creation failed:', error);
  }
};

const optimizeDatabase = async () => {
  try {
    console.log('Optimizing database performance...');

    // Enable MongoDB query profiler for development (only if allowed)
    if (process.env.NODE_ENV === 'development') {
      try {
        await mongoose.connection.db.setProfilingLevel('slow_only', { slowms: 100 });
        console.log('✅ Query profiling enabled for development');
      } catch (profilingError) {
        console.log('ℹ️ Query profiling not available on this cluster');
      }
    }

    console.log('✅ Database optimization completed');
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
  }
};

module.exports = {
  setupDatabase,
  optimizeDatabase
};
