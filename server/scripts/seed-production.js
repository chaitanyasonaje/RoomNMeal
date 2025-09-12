const mongoose = require('mongoose');
const User = require('../models/User');
const Room = require('../models/Room');
const MessPlan = require('../models/MessPlan');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const MessSubscription = require('../models/MessSubscription');
const Transaction = require('../models/Transaction');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');

// Production sample data
const productionUsers = [
  {
    name: 'Admin User',
    email: 'admin@roomnmeal.com',
    phone: '+91 99999 99999',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
    isActive: true,
    referralCode: 'ADMIN001',
    wallet: { balance: 0 }
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'student',
    college: 'Shirpur Engineering College',
    year: '3rd Year',
    branch: 'Computer Engineering',
    address: {
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405',
      address: 'Near Engineering College'
    },
    isVerified: true,
    isActive: true,
    wallet: { balance: 1000 }
  },
  {
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 98765 43211',
    password: 'password123',
    role: 'host',
    address: {
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405',
      address: 'Near Engineering College'
    },
    verificationStatus: 'verified',
    isVerified: true,
    isActive: true,
    hostDetails: {
      propertyType: 'PG',
      totalRooms: 15,
      availableRooms: 8,
      amenities: ['WiFi', 'AC', 'Food', 'Parking'],
      rules: ['No smoking', 'No pets', 'No loud music after 10 PM']
    },
    wallet: { balance: 0 }
  },
  {
    name: 'Sunita Devi',
    email: 'sunita@example.com',
    phone: '+91 98765 43212',
    password: 'password123',
    role: 'messProvider',
    address: {
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405',
      address: 'Near Engineering College'
    },
    verificationStatus: 'verified',
    isVerified: true,
    isActive: true,
    messDetails: {
      messName: 'Sunita\'s Kitchen',
      cuisine: ['North Indian', 'South Indian', 'Gujarati'],
      mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
      capacity: 100,
      hygieneRating: 4.8
    },
    wallet: { balance: 0 }
  }
];

const productionRooms = [
  {
    title: 'Premium Single Room with AC',
    description: 'Spacious single room with attached bathroom, AC, WiFi, and modern amenities. Perfect for students who want comfort and privacy.',
    propertyType: 'PG',
    roomType: 'Single',
    rent: 8000,
    deposit: 5000,
    address: {
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405',
      address: 'Near Engineering College, Main Road'
    },
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Food', 'Parking', 'Washing Machine'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
    ],
    availableFrom: new Date('2024-06-01'),
    isAvailable: true,
    ratings: { average: 4.5, count: 12 },
    rules: ['No smoking', 'No pets', 'No loud music after 10 PM'],
    isActive: true
  },
  {
    title: 'Cozy Double Sharing Room',
    description: 'Comfortable double sharing room with shared bathroom and basic amenities. Great for budget-conscious students.',
    propertyType: 'Hostel',
    roomType: 'Double',
    rent: 5000,
    deposit: 3000,
    address: {
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405',
      address: 'Near Engineering College, Hostel Area'
    },
    amenities: ['Fan', 'Shared Bathroom', 'Food', 'Parking', 'Common Room'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    ],
    availableFrom: new Date('2024-06-01'),
    isAvailable: true,
    ratings: { average: 4.2, count: 8 },
    rules: ['No smoking', 'No pets'],
    isActive: true
  },
  {
    title: 'Triple Sharing Economy Room',
    description: 'Budget-friendly triple sharing room with all basic amenities. Perfect for students looking for affordable accommodation.',
    propertyType: 'PG',
    roomType: 'Triple',
    rent: 3500,
    deposit: 2000,
    address: {
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405',
      address: 'Near Engineering College, Student Area'
    },
    amenities: ['Fan', 'Shared Bathroom', 'Food', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
    ],
    availableFrom: new Date('2024-06-01'),
    isAvailable: true,
    ratings: { average: 3.8, count: 15 },
    rules: ['No smoking', 'No pets'],
    isActive: true
  }
];

const productionMessPlans = [
  {
    name: 'Premium Veg Thali',
    description: 'Complete vegetarian meal with 4 rotis, dal, sabzi, rice, salad, and dessert. Fresh and hygienic food prepared daily.',
    price: 2500,
    duration: '1 month',
    mealsPerDay: 2,
    mealTimings: ['8:00 AM - 10:00 AM', '7:00 PM - 9:00 PM'],
    cuisine: 'North Indian',
    isVegetarian: true,
    isAvailable: true,
    ratings: { average: 4.6, count: 20 },
    features: ['Fresh vegetables', 'Home-cooked', 'Hygienic kitchen', 'Variety in menu'],
    isActive: true
  },
  {
    name: 'Budget Non-Veg Plan',
    description: 'Affordable non-vegetarian meals with 3 rotis, dal, chicken/fish curry, rice, and salad.',
    price: 3000,
    duration: '1 month',
    mealsPerDay: 2,
    mealTimings: ['8:00 AM - 10:00 AM', '7:00 PM - 9:00 PM'],
    cuisine: 'Mixed',
    isVegetarian: false,
    isAvailable: true,
    ratings: { average: 4.3, count: 15 },
    features: ['Fresh meat', 'Spicy curries', 'Variety in non-veg', 'Hygienic preparation'],
    isActive: true
  },
  {
    name: 'South Indian Special',
    description: 'Authentic South Indian meals with rice, sambar, rasam, curries, and traditional sweets.',
    price: 2200,
    duration: '1 month',
    mealsPerDay: 2,
    mealTimings: ['8:00 AM - 10:00 AM', '7:00 PM - 9:00 PM'],
    cuisine: 'South Indian',
    isVegetarian: true,
    isAvailable: true,
    ratings: { average: 4.4, count: 18 },
    features: ['Authentic taste', 'Traditional recipes', 'Spicy sambar', 'Variety in curries'],
    isActive: true
  }
];

const productionServices = [
  {
    name: 'Premium Laundry Service',
    type: 'laundry',
    description: 'Professional laundry service with pickup and delivery. We handle all types of clothes with care.',
    price: 150,
    priceType: 'per_kg',
    duration: '24 hours',
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['9:00 AM - 6:00 PM'],
      isAvailable: true
    },
    location: {
      address: 'Near Engineering College, Shirpur',
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405'
    },
    features: ['Pickup & Delivery', 'Dry Cleaning', 'Ironing', 'Stain Removal'],
    category: 'laundry',
    isVerified: true,
    isActive: true,
    maxOrders: 50,
    currentOrders: 15,
    ratings: { average: 4.5, count: 25 }
  },
  {
    name: 'Room Cleaning Service',
    type: 'cleaning',
    description: 'Professional room cleaning service including dusting, mopping, and sanitization.',
    price: 200,
    priceType: 'per_visit',
    duration: '2 hours',
    availability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
      timeSlots: ['10:00 AM - 4:00 PM'],
      isAvailable: true
    },
    location: {
      address: 'Near Engineering College, Shirpur',
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405'
    },
    features: ['Deep Cleaning', 'Sanitization', 'Dusting', 'Mopping'],
    category: 'cleaning',
    isVerified: true,
    isActive: true,
    maxOrders: 30,
    currentOrders: 8,
    ratings: { average: 4.3, count: 12 }
  }
];

async function seedProductionData() {
  try {
    console.log('🌱 Starting production data seeding...');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('ℹ️ Data already exists, skipping seeding');
      return;
    }

    // Hash passwords
    const hashedUsers = await Promise.all(
      productionUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // Create users
    const createdUsers = await User.insertMany(hashedUsers);
    const [admin, student, host, messProvider] = createdUsers;
    console.log(`✅ Created ${createdUsers.length} users`);

    // Update room references
    productionRooms.forEach(room => room.host = host._id);
    productionMessPlans.forEach(plan => plan.provider = messProvider._id);
    productionServices.forEach(service => service.provider = host._id);

    // Create rooms
    const createdRooms = await Room.insertMany(productionRooms);
    console.log(`✅ Created ${createdRooms.length} rooms`);

    // Create mess plans
    const createdMessPlans = await MessPlan.insertMany(productionMessPlans);
    console.log(`✅ Created ${createdMessPlans.length} mess plans`);

    // Create services
    const createdServices = await Service.insertMany(productionServices);
    console.log(`✅ Created ${createdServices.length} services`);

    // Create some sample bookings
    const sampleBookings = [
      {
        student: student._id,
        room: createdRooms[0]._id,
        host: host._id,
        checkIn: new Date('2024-06-01'),
        checkOut: new Date('2024-12-31'),
        totalAmount: 8000,
        status: 'confirmed',
        paymentStatus: 'paid'
      }
    ];
    await Booking.insertMany(sampleBookings);
    console.log(`✅ Created ${sampleBookings.length} sample bookings`);

    // Create some sample reviews
    const sampleReviews = [
      {
        user: student._id,
        room: createdRooms[0]._id,
        rating: 5,
        comment: 'Great room with all amenities. Highly recommended!',
        isVerified: true
      },
      {
        user: student._id,
        messPlan: createdMessPlans[0]._id,
        rating: 4,
        comment: 'Good food quality and variety. Could be more spicy.',
        isVerified: true
      }
    ];
    await Review.insertMany(sampleReviews);
    console.log(`✅ Created ${sampleReviews.length} sample reviews`);

    console.log('🎉 Production data seeding completed successfully!');
    console.log(`📊 Summary: ${createdUsers.length} users, ${createdRooms.length} rooms, ${createdMessPlans.length} mess plans, ${createdServices.length} services`);

  } catch (error) {
    console.error('❌ Error seeding production data:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  seedProductionData()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedProductionData };
