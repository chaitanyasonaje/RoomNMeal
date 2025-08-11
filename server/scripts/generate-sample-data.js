const mongoose = require('mongoose');
const User = require('../models/User');
const Room = require('../models/Room');
const MessPlan = require('../models/MessPlan');
const Service = require('../models/Service');

// Sample data arrays
const sampleUsers = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'student',
    college: 'Shirpur Engineering College',
    year: '3rd Year',
    branch: 'Computer Engineering',
    address: {
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405',
      address: 'Near Engineering College'
    }
  },
  {
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 98765 43212',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'host',
    address: {
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405',
      address: 'Near Engineering College'
    },
    verificationStatus: 'verified'
  },
  {
    name: 'Sunita Devi',
    email: 'sunita.devi@example.com',
    phone: '+91 98765 43213',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'messProvider',
    address: {
      city: 'Shirpur',
      state: 'Maharashtra',
      pincode: '425405',
      address: 'Near Engineering College'
    },
    verificationStatus: 'verified'
  }
];

const sampleRooms = [
  {
    title: 'Premium Single Room with AC',
    description: 'Spacious single room with attached bathroom, AC, WiFi, and modern amenities.',
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
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Food', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'
    ],
    availableFrom: new Date('2024-06-01'),
    isAvailable: true,
    ratings: { average: 4.5, count: 12 }
  },
  {
    title: 'Cozy Double Sharing Room',
    description: 'Comfortable double sharing room with shared bathroom and basic amenities.',
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
    amenities: ['Fan', 'Shared Bathroom', 'Food', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'
    ],
    availableFrom: new Date('2024-06-01'),
    isAvailable: true,
    ratings: { average: 4.2, count: 8 }
  }
];

const sampleMessPlans = [
  {
    name: 'Premium Veg Thali',
    description: 'Complete vegetarian meal with 4 rotis, dal, sabzi, rice, and dessert.',
    price: 2500,
    duration: '1 month',
    mealsPerDay: 2,
    mealTimings: ['8:00 AM - 10:00 AM', '7:00 PM - 9:00 PM'],
    cuisine: 'North Indian',
    isVegetarian: true,
    isAvailable: true,
    ratings: { average: 4.6, count: 20 }
  },
  {
    name: 'Budget Non-Veg Plan',
    description: 'Affordable non-vegetarian meals with 3 rotis, dal, chicken/fish curry, rice.',
    price: 3000,
    duration: '1 month',
    mealsPerDay: 2,
    mealTimings: ['8:00 AM - 10:00 AM', '7:00 PM - 9:00 PM'],
    cuisine: 'Mixed',
    isVegetarian: false,
    isAvailable: true,
    ratings: { average: 4.3, count: 15 }
  }
];

const sampleServices = [
  {
    name: 'Premium Laundry Service',
    type: 'laundry',
    description: 'Professional laundry service with pickup and delivery.',
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
    features: ['Pickup & Delivery', 'Dry Cleaning', 'Ironing'],
    category: 'laundry',
    isVerified: true,
    isActive: true,
    maxOrders: 50,
    currentOrders: 15
  }
];

async function generateSampleData() {
  try {
    console.log('🚀 Starting sample data generation...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Room.deleteMany({}),
      MessPlan.deleteMany({}),
      Service.deleteMany({})
    ]);

    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    const [student, host, messProvider] = createdUsers;

    // Update references
    sampleRooms.forEach(room => room.host = host._id);
    sampleMessPlans.forEach(plan => plan.provider = messProvider._id);
    sampleServices.forEach(service => service.provider = host._id);

    // Create other entities
    const createdRooms = await Room.insertMany(sampleRooms);
    const createdMessPlans = await MessPlan.insertMany(sampleMessPlans);
    const createdServices = await Service.insertMany(sampleServices);

    console.log('✅ Sample data generated successfully!');
    console.log(`📊 Created: ${createdUsers.length} users, ${createdRooms.length} rooms, ${createdMessPlans.length} mess plans, ${createdServices.length} services`);

  } catch (error) {
    console.error('❌ Error generating sample data:', error);
  }
}

module.exports = { generateSampleData };

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roomnmeal')
    .then(() => generateSampleData())
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Database connection error:', error);
      process.exit(1);
    });
}
