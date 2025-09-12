const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Room = require('./models/Room');
const MessPlan = require('./models/MessPlan');
const Booking = require('./models/Booking');
const Service = require('./models/Service');
const ServiceOrder = require('./models/ServiceOrder');
const MessSubscription = require('./models/MessSubscription');
const Transaction = require('./models/Transaction');
const Review = require('./models/Review');
const Notification = require('./models/Notification');
const ChatMessage = require('./models/ChatMessage');

// Mock data arrays
const mockData = {
  users: [],
  rooms: [],
  messPlans: [],
  bookings: [],
  services: [],
  serviceOrders: [],
  messSubscriptions: [],
  transactions: [],
  reviews: [],
  notifications: [],
  chatMessages: []
};

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomPhone = () => `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`;

// Sample data arrays
const names = [
  'Aarav Sharma', 'Priya Patel', 'Rahul Kumar', 'Sneha Singh', 'Vikram Gupta',
  'Ananya Reddy', 'Arjun Mehta', 'Kavya Iyer', 'Rohan Joshi', 'Isha Agarwal',
  'Karan Malhotra', 'Divya Nair', 'Siddharth Rao', 'Pooja Desai', 'Amit Shah',
  'Neha Verma', 'Ravi Tiwari', 'Shruti Jain', 'Deepak Singh', 'Meera Chopra',
  'Rajesh Kumar', 'Sunita Sharma', 'Vikash Yadav', 'Ritu Agarwal', 'Suresh Pandey',
  'Geeta Singh', 'Manoj Gupta', 'Kiran Patel', 'Naveen Reddy', 'Sushma Iyer',
  'Pradeep Joshi', 'Lakshmi Nair', 'Ganesh Rao', 'Kamala Desai', 'Srinivas Shah'
];

const colleges = [
  'IIT Delhi', 'IIT Mumbai', 'IIT Bangalore', 'IIT Chennai', 'IIT Kanpur',
  'IIT Kharagpur', 'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IIT Indore',
  'NIT Delhi', 'NIT Mumbai', 'NIT Bangalore', 'NIT Chennai', 'NIT Kanpur',
  'Delhi University', 'Mumbai University', 'Bangalore University', 'Anna University',
  'Jadavpur University', 'BITS Pilani', 'VIT Vellore', 'Manipal University',
  'Amity University', 'SRM University', 'LPU', 'Chandigarh University'
];

const cities = [
  { id: 'delhi', name: 'Delhi', state: 'Delhi' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh' }
];

const propertyTypes = ['PG', 'Hostel', 'Apartment', 'House'];
const roomTypes = ['Single', 'Double', 'Triple', 'Quad'];
const cuisines = ['North Indian', 'South Indian', 'Gujarati', 'Punjabi', 'Rajasthani', 'Bengali', 'Maharashtrian', 'Jain', 'Veg', 'Non-Veg'];
const mealTypes = ['breakfast', 'lunch', 'dinner'];
const serviceTypes = ['laundry', 'cleaning', 'food', 'transport', 'maintenance', 'other'];
const serviceCategories = ['Home Services', 'Food & Dining', 'Transportation', 'Maintenance', 'Personal Care', 'Education'];

// Generate mock users
async function generateUsers() {
  console.log('Generating Users...');
  
  for (let i = 0; i < 50; i++) {
    const role = i < 20 ? 'student' : i < 35 ? 'host' : i < 45 ? 'messProvider' : 'admin';
    const name = getRandomElement(names);
    const email = `${name.toLowerCase().replace(' ', '.')}${i}@example.com`;
    
    const user = {
      name,
      email,
      password: await bcrypt.hash('password123', 10),
      phone: getRandomPhone(),
      role,
      isVerified: Math.random() > 0.2,
      isActive: true,
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      collegeId: `COL${String(i).padStart(3, '0')}`,
      collegeName: getRandomElement(colleges),
      address: {
        street: `${Math.floor(Math.random() * 999) + 1} Street`,
        city: getRandomElement(cities).name,
        state: getRandomElement(cities).state,
        pincode: `${Math.floor(Math.random() * 900000) + 100000}`
      },
      wallet: {
        balance: Math.floor(Math.random() * 5000),
        transactions: []
      }
    };

    // Add role-specific details
    if (role === 'student') {
      user.studentDetails = {
        college: getRandomElement(colleges),
        course: getRandomElement(['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'MBA', 'BBA']),
        year: Math.floor(Math.random() * 4) + 1,
        studentId: `STU${String(i).padStart(4, '0')}`,
        emergencyContact: {
          name: getRandomElement(names),
          phone: getRandomPhone(),
          relation: getRandomElement(['Father', 'Mother', 'Brother', 'Sister', 'Guardian'])
        }
      };
    } else if (role === 'host') {
      user.hostDetails = {
        propertyType: getRandomElement(propertyTypes),
        totalRooms: Math.floor(Math.random() * 20) + 5,
        availableRooms: Math.floor(Math.random() * 10) + 1,
        amenities: getRandomElements(['WiFi', 'AC', 'Geyser', 'Washing Machine', 'Parking', 'Security', 'CCTV', 'Lift'], 4),
        rules: getRandomElements(['No smoking', 'No pets', 'No loud music after 10 PM', 'No cooking', 'No guests'], 3),
        documents: [
          { name: 'Property Deed', url: 'https://example.com/deed.pdf' },
          { name: 'Electricity Bill', url: 'https://example.com/electricity.pdf' }
        ]
      };
    } else if (role === 'messProvider') {
      user.messDetails = {
        messName: `${name}'s Mess`,
        cuisine: getRandomElements(cuisines, 3),
        mealTypes: getRandomElements(mealTypes, 3),
        capacity: Math.floor(Math.random() * 100) + 20,
        hygieneRating: Math.floor(Math.random() * 5) + 1,
        documents: [
          { name: 'FSSAI License', url: 'https://example.com/fssai.pdf' },
          { name: 'Health Certificate', url: 'https://example.com/health.pdf' }
        ],
        kitchenPhotos: [
          'https://example.com/kitchen1.jpg',
          'https://example.com/kitchen2.jpg'
        ]
      };
    }

    user.preferences = {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      dietaryRestrictions: getRandomElements(['Vegetarian', 'Non-Vegetarian', 'Jain', 'Vegan', 'Gluten-Free'], 2),
      mealTimings: {
        breakfast: '8:00 AM',
        lunch: '1:00 PM',
        dinner: '8:00 PM'
      }
    };

    mockData.users.push(user);
  }
  
  console.log(`Generated ${mockData.users.length} users`);
}

// Generate mock rooms
async function generateRooms() {
  console.log('Generating Rooms...');
  
  const hosts = mockData.users.filter(user => user.role === 'host');
  
  for (let i = 0; i < 40; i++) {
    const host = getRandomElement(hosts);
    const city = getRandomElement(cities);
    const propertyType = getRandomElement(propertyTypes);
    const roomType = getRandomElement(roomTypes);
    
    const room = {
      host: null, // Will be set after user creation
      title: `${roomType} ${propertyType} Room in ${city.name}`,
      description: `Comfortable ${roomType.toLowerCase()} room in a well-maintained ${propertyType.toLowerCase()}. Perfect for students with all necessary amenities.`,
      propertyType,
      roomType,
      rent: Math.floor(Math.random() * 15000) + 5000,
      securityDeposit: Math.floor(Math.random() * 10000) + 5000,
      address: {
        street: `${Math.floor(Math.random() * 999) + 1} ${getRandomElement(['Main Road', 'Park Street', 'MG Road', 'Station Road'])}`,
        city: {
          id: city.id,
          name: city.name,
          state: city.state
        },
        pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
        coordinates: {
          latitude: 12.9716 + (Math.random() - 0.5) * 0.1,
          longitude: 77.5946 + (Math.random() - 0.5) * 0.1
        }
      },
      nearbyColleges: getRandomElements(colleges, 3).map(college => ({
        name: college,
        distance: Math.floor(Math.random() * 5) + 1
      })),
      amenities: getRandomElements(['WiFi', 'AC', 'Geyser', 'Washing Machine', 'Parking', 'Security', 'CCTV', 'Lift', 'Gym', 'Common Room'], 6),
      rules: getRandomElements(['No smoking', 'No pets', 'No loud music after 10 PM', 'No cooking', 'No guests', 'Keep room clean'], 4),
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'
      ],
      availability: {
        isAvailable: Math.random() > 0.2,
        totalRooms: Math.floor(Math.random() * 10) + 1,
        occupiedRooms: Math.floor(Math.random() * 5)
      },
      mealOptions: {
        hasMeals: Math.random() > 0.5,
        mealTypes: getRandomElements(mealTypes, 3),
        mealPrice: {
          breakfast: Math.floor(Math.random() * 50) + 30,
          lunch: Math.floor(Math.random() * 100) + 50,
          dinner: Math.floor(Math.random() * 100) + 50
        }
      },
      additionalServices: {
        laundry: {
          available: Math.random() > 0.3,
          price: Math.floor(Math.random() * 200) + 100
        },
        tea: {
          available: Math.random() > 0.4,
          price: Math.floor(Math.random() * 50) + 20
        }
      },
      ratings: {
        average: Math.random() * 2 + 3,
        count: Math.floor(Math.random() * 20),
        totalRatingScore: Math.floor(Math.random() * 100),
        totalRatings: Math.floor(Math.random() * 20)
      },
      reviews: [],
      isVerified: Math.random() > 0.3,
      isActive: true,
      views: Math.floor(Math.random() * 1000),
      favorites: []
    };

    mockData.rooms.push(room);
  }
  
  console.log(`Generated ${mockData.rooms.length} rooms`);
}

// Generate mock mess plans
async function generateMessPlans() {
  console.log('Generating Mess Plans...');
  
  const messProviders = mockData.users.filter(user => user.role === 'messProvider');
  
  for (let i = 0; i < 35; i++) {
    const provider = getRandomElement(messProviders);
    const city = getRandomElement(cities);
    const planType = getRandomElement(['weekly', 'monthly']);
    const duration = planType === 'weekly' ? 7 : 30;
    
    const messPlan = {
      provider: null, // Will be set after user creation
      city: {
        id: city.id,
        name: city.name,
        state: city.state
      },
      planName: `${getRandomElement(cuisines)} ${planType === 'weekly' ? 'Weekly' : 'Monthly'} Plan`,
      description: `Delicious ${getRandomElement(cuisines).toLowerCase()} meals prepared with fresh ingredients. ${planType === 'weekly' ? '7 days' : '30 days'} of wholesome food.`,
      planType,
      duration,
      price: planType === 'weekly' ? Math.floor(Math.random() * 2000) + 800 : Math.floor(Math.random() * 6000) + 3000,
      mealTypes: getRandomElements(mealTypes, 3),
      cuisine: getRandomElements(cuisines, 2),
      dietaryOptions: getRandomElements(['Veg', 'Non-Veg', 'Jain', 'Vegan'], 2),
      menu: {
        breakfast: getRandomElements(['Poha', 'Upma', 'Idli', 'Paratha', 'Bread Butter', 'Cornflakes'], 4),
        lunch: getRandomElements(['Dal Rice', 'Rajma', 'Chole', 'Paneer', 'Chicken Curry', 'Fish Curry'], 4),
        dinner: getRandomElements(['Roti Sabzi', 'Biryani', 'Pulao', 'Noodles', 'Pasta', 'Soup'], 4)
      },
      mealTimings: {
        breakfast: '8:00 AM',
        lunch: '1:00 PM',
        dinner: '8:00 PM'
      },
      capacity: Math.floor(Math.random() * 100) + 20,
      currentSubscribers: Math.floor(Math.random() * 50),
      hygieneRating: Math.floor(Math.random() * 2) + 4,
      isActive: Math.random() > 0.1,
      isVerified: Math.random() > 0.2,
      images: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500'
      ],
      documents: [
        { name: 'FSSAI License', url: 'https://example.com/fssai.pdf' },
        { name: 'Health Certificate', url: 'https://example.com/health.pdf' }
      ],
      ratings: {
        average: Math.random() * 2 + 3,
        count: Math.floor(Math.random() * 15)
      },
      reviews: [],
      features: getRandomElements(['Home-cooked', 'Fresh ingredients', 'Hygienic kitchen', 'Varied menu', 'On-time delivery'], 3),
      cancellationPolicy: 'No refund after subscription starts'
    };

    mockData.messPlans.push(messPlan);
  }
  
  console.log(`Generated ${mockData.messPlans.length} mess plans`);
}

// Generate mock services
async function generateServices() {
  console.log('Generating Services...');
  
  const serviceProviders = mockData.users.filter(user => user.role === 'host' || user.role === 'messProvider');
  
  for (let i = 0; i < 40; i++) {
    const provider = getRandomElement(serviceProviders);
    const serviceType = getRandomElement(serviceTypes);
    const category = getRandomElement(serviceCategories);
    const city = getRandomElement(cities);
    
    const service = {
      name: `${getRandomElement(['Professional', 'Quick', 'Reliable', 'Premium', 'Express'])} ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service`,
      type: serviceType,
      provider: null, // Will be set after user creation
      description: `High-quality ${serviceType} service with professional staff and modern equipment. We ensure customer satisfaction and timely delivery.`,
      price: Math.floor(Math.random() * 500) + 100,
      priceType: getRandomElement(['per_item', 'per_kg', 'per_meal', 'per_trip', 'per_hour', 'fixed']),
      duration: getRandomElement(['1 hour', '2 hours', 'Half day', 'Full day', '1 week', '1 month']),
      availability: {
        days: getRandomElements(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], 5),
        timeSlots: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' }
        ],
        isAvailable: Math.random() > 0.1
      },
      location: {
        address: `${Math.floor(Math.random() * 999) + 1} Service Center`,
        city: city.name,
        state: city.state,
        pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
        coordinates: {
          lat: 12.9716 + (Math.random() - 0.5) * 0.1,
          lng: 77.5946 + (Math.random() - 0.5) * 0.1
        },
        serviceRadius: Math.floor(Math.random() * 20) + 5
      },
      features: [
        { name: 'Professional Staff', description: 'Trained and experienced professionals', included: true },
        { name: 'Quality Assurance', description: '100% quality guarantee', included: true },
        { name: 'Timely Delivery', description: 'On-time service delivery', included: true }
      ],
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        'https://images.unsplash.com/photo-1581578731548-c6d0f7624a5e?w=500'
      ],
      documents: [
        { name: 'Service License', url: 'https://example.com/license.pdf', type: 'license' },
        { name: 'Insurance Certificate', url: 'https://example.com/insurance.pdf', type: 'insurance' }
      ],
      rating: {
        average: Math.random() * 2 + 3,
        totalReviews: Math.floor(Math.random() * 20)
      },
      isVerified: Math.random() > 0.3,
      isActive: Math.random() > 0.1,
      isFeatured: Math.random() > 0.7,
      maxOrders: Math.floor(Math.random() * 50) + 10,
      currentOrders: Math.floor(Math.random() * 20),
      tags: getRandomElements(['professional', 'reliable', 'affordable', 'quick', 'quality'], 3),
      category,
      subcategory: getRandomElement(['Home Cleaning', 'Car Wash', 'Food Delivery', 'Taxi Service', 'Repair Service']),
      requirements: getRandomElements(['Valid ID', 'Contact number', 'Address proof', 'Service area'], 2),
      cancellationPolicy: getRandomElement(['flexible', 'moderate', 'strict']),
      refundPolicy: 'Full refund if cancelled 24 hours before service',
      terms: 'Service terms and conditions apply'
    };

    mockData.services.push(service);
  }
  
  console.log(`Generated ${mockData.services.length} services`);
}

// Main function to generate all mock data
async function generateAllMockData() {
  try {
    console.log('Starting mock data generation...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roomnmeal');
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Room.deleteMany({});
    await MessPlan.deleteMany({});
    await Booking.deleteMany({});
    await Service.deleteMany({});
    await ServiceOrder.deleteMany({});
    await MessSubscription.deleteMany({});
    await Transaction.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    await ChatMessage.deleteMany({});

    // Generate mock data
    await generateUsers();
    await generateRooms();
    await generateMessPlans();
    await generateServices();

    // Save users to database first
    console.log('Saving users to database...');
    const savedUsers = await User.insertMany(mockData.users);
    console.log(`Saved ${savedUsers.length} users`);

    // Update room hosts and save rooms
    console.log('Saving rooms to database...');
    const hosts = savedUsers.filter(user => user.role === 'host');
    for (let i = 0; i < mockData.rooms.length; i++) {
      mockData.rooms[i].host = hosts[i % hosts.length]._id;
    }
    const savedRooms = await Room.insertMany(mockData.rooms);
    console.log(`Saved ${savedRooms.length} rooms`);

    // Update mess plan providers and save mess plans
    console.log('Saving mess plans to database...');
    const messProviders = savedUsers.filter(user => user.role === 'messProvider');
    for (let i = 0; i < mockData.messPlans.length; i++) {
      mockData.messPlans[i].provider = messProviders[i % messProviders.length]._id;
    }
    const savedMessPlans = await MessPlan.insertMany(mockData.messPlans);
    console.log(`Saved ${savedMessPlans.length} mess plans`);

    // Update service providers and save services
    console.log('Saving services to database...');
    const serviceProviders = savedUsers.filter(user => user.role === 'host' || user.role === 'messProvider');
    for (let i = 0; i < mockData.services.length; i++) {
      mockData.services[i].provider = serviceProviders[i % serviceProviders.length]._id;
    }
    const savedServices = await Service.insertMany(mockData.services);
    console.log(`Saved ${savedServices.length} services`);

    // Generate and save additional entities
    await generateAdditionalEntities(savedUsers, savedRooms, savedMessPlans, savedServices);

    console.log('Mock data generation completed successfully!');
    console.log(`Total records created:`);
    console.log(`- Users: ${savedUsers.length}`);
    console.log(`- Rooms: ${savedRooms.length}`);
    console.log(`- Mess Plans: ${savedMessPlans.length}`);
    console.log(`- Services: ${savedServices.length}`);

  } catch (error) {
    console.error('Error generating mock data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Generate additional entities (bookings, subscriptions, etc.)
async function generateAdditionalEntities(users, rooms, messPlans, services) {
  console.log('Generating additional entities...');
  
  const students = users.filter(user => user.role === 'student');
  const hosts = users.filter(user => user.role === 'host');
  
  // Generate bookings
  console.log('Generating bookings...');
  const bookings = [];
  for (let i = 0; i < 30; i++) {
    const student = getRandomElement(students);
    const room = getRandomElement(rooms);
    const host = hosts.find(h => h._id.toString() === room.host.toString());
    
    const checkIn = getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    const checkOut = new Date(checkIn.getTime() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000);
    const totalAmount = room.rent * Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const booking = {
      student: student._id,
      room: room._id,
      host: host._id,
      checkIn,
      checkOut,
      status: getRandomElement(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
      totalAmount,
      paidAmount: Math.random() > 0.2 ? totalAmount : Math.floor(totalAmount * 0.5),
      paymentStatus: getRandomElement(['pending', 'partial', 'completed', 'failed']),
      paymentMethod: getRandomElement(['razorpay', 'wallet', 'cash']),
      additionalServices: {
        meals: {
          included: Math.random() > 0.5,
          mealTypes: getRandomElements(mealTypes, 2),
          price: Math.floor(Math.random() * 2000) + 1000
        },
        laundry: {
          included: Math.random() > 0.6,
          price: Math.floor(Math.random() * 500) + 200
        },
        tea: {
          included: Math.random() > 0.7,
          price: Math.floor(Math.random() * 300) + 100
        }
      },
      specialRequests: Math.random() > 0.5 ? 'Please provide extra blankets' : '',
      isActive: true
    };
    
    bookings.push(booking);
  }
  
  const savedBookings = await Booking.insertMany(bookings);
  console.log(`Saved ${savedBookings.length} bookings`);

  // Generate mess subscriptions
  console.log('Generating mess subscriptions...');
  const subscriptions = [];
  for (let i = 0; i < 25; i++) {
    const student = getRandomElement(students);
    const messPlan = getRandomElement(messPlans);
    
    const startDate = getRandomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    const endDate = new Date(startDate.getTime() + messPlan.duration * 24 * 60 * 60 * 1000);
    
    const subscription = {
      student: student._id,
      messPlan: messPlan._id,
      startDate,
      endDate,
      status: getRandomElement(['active', 'paused', 'cancelled', 'completed']),
      mealPreferences: {
        breakfast: Math.random() > 0.2,
        lunch: Math.random() > 0.1,
        dinner: Math.random() > 0.1
      },
      dietaryRestrictions: getRandomElements(['Vegetarian', 'Non-Vegetarian', 'Jain', 'Vegan'], 2),
      totalAmount: messPlan.price,
      paidAmount: Math.random() > 0.3 ? messPlan.price : Math.floor(messPlan.price * 0.7),
      paymentStatus: getRandomElement(['pending', 'partial', 'completed', 'failed']),
      paymentMethod: getRandomElement(['razorpay', 'wallet', 'cash']),
      isActive: true
    };
    
    subscriptions.push(subscription);
  }
  
  const savedSubscriptions = await MessSubscription.insertMany(subscriptions);
  console.log(`Saved ${savedSubscriptions.length} mess subscriptions`);

  // Generate service orders
  console.log('Generating service orders...');
  const serviceOrders = [];
  for (let i = 0; i < 35; i++) {
    const customer = getRandomElement(students);
    const service = getRandomElement(services);
    const provider = users.find(u => u._id.toString() === service.provider.toString());
    
    const quantity = Math.floor(Math.random() * 5) + 1;
    const subtotal = service.price * quantity;
    const tax = Math.floor(subtotal * 0.18);
    const total = subtotal + tax;
    
    const serviceOrder = {
      service: service._id,
      customer: customer._id,
      provider: provider._id,
      orderDetails: {
        quantity,
        unit: getRandomElement(['kg', 'items', 'hours', 'pieces']),
        specialInstructions: Math.random() > 0.6 ? 'Please handle with care' : '',
        requirements: getRandomElements(['Valid ID', 'Contact number', 'Address proof'], 2),
        pickupAddress: {
          address: `${Math.floor(Math.random() * 999) + 1} Pickup Street`,
          city: getRandomElement(cities).name,
          state: getRandomElement(cities).state,
          pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
          coordinates: {
            lat: 12.9716 + (Math.random() - 0.5) * 0.1,
            lng: 77.5946 + (Math.random() - 0.5) * 0.1
          }
        },
        deliveryAddress: {
          address: `${Math.floor(Math.random() * 999) + 1} Delivery Street`,
          city: getRandomElement(cities).name,
          state: getRandomElement(cities).state,
          pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
          coordinates: {
            lat: 12.9716 + (Math.random() - 0.5) * 0.1,
            lng: 77.5946 + (Math.random() - 0.5) * 0.1
          }
        },
        scheduledDate: getRandomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        scheduledTime: getRandomElement(['09:00', '12:00', '15:00', '18:00'])
      },
      pricing: {
        unitPrice: service.price,
        quantity,
        subtotal,
        tax,
        discount: Math.floor(Math.random() * 100),
        total,
        currency: 'INR'
      },
      status: getRandomElement(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
      payment: {
        method: getRandomElement(['wallet', 'razorpay', 'cash']),
        status: getRandomElement(['pending', 'completed', 'failed']),
        paidAt: Math.random() > 0.3 ? new Date() : null
      },
      isActive: true
    };
    
    serviceOrders.push(serviceOrder);
  }
  
  const savedServiceOrders = await ServiceOrder.insertMany(serviceOrders);
  console.log(`Saved ${savedServiceOrders.length} service orders`);

  // Generate transactions
  console.log('Generating transactions...');
  const transactions = [];
  for (let i = 0; i < 50; i++) {
    const user = getRandomElement(users);
    const transaction = {
      user: user._id,
      type: getRandomElement(['room_booking', 'mess_subscription', 'laundry_service', 'tea_service', 'wallet_recharge', 'refund']),
      amount: Math.floor(Math.random() * 10000) + 500,
      currency: 'INR',
      status: getRandomElement(['pending', 'completed', 'failed', 'refunded']),
      paymentMethod: getRandomElement(['razorpay', 'wallet', 'cash']),
      description: `Payment for ${getRandomElement(['room booking', 'mess subscription', 'service order', 'wallet recharge'])}`,
      walletBalance: {
        before: Math.floor(Math.random() * 5000),
        after: Math.floor(Math.random() * 5000)
      }
    };
    
    transactions.push(transaction);
  }
  
  const savedTransactions = await Transaction.insertMany(transactions);
  console.log(`Saved ${savedTransactions.length} transactions`);

  // Generate reviews
  console.log('Generating reviews...');
  const reviews = [];
  for (let i = 0; i < 40; i++) {
    const user = getRandomElement(users);
    const target = Math.random() > 0.5 ? getRandomElement(rooms) : getRandomElement(messPlans);
    const targetModel = target.rent ? 'Room' : 'MessPlan';
    
    const review = {
      userId: user._id,
      targetId: target._id,
      targetModel,
      rating: Math.floor(Math.random() * 5) + 1,
      title: getRandomElement(['Great experience!', 'Highly recommended', 'Good service', 'Average quality', 'Could be better']),
      comment: getRandomElement([
        'Excellent service and quality. Highly recommended!',
        'Good experience overall, would use again.',
        'Average service, could be improved.',
        'Not satisfied with the quality.',
        'Outstanding service, exceeded expectations!'
      ]),
      isVerified: Math.random() > 0.3,
      isActive: true
    };
    
    reviews.push(review);
  }
  
  const savedReviews = await Review.insertMany(reviews);
  console.log(`Saved ${savedReviews.length} reviews`);

  // Generate notifications
  console.log('Generating notifications...');
  const notifications = [];
  for (let i = 0; i < 60; i++) {
    const recipient = getRandomElement(users);
    const sender = Math.random() > 0.5 ? getRandomElement(users) : null;
    
    const notification = {
      recipient: recipient._id,
      sender: sender ? sender._id : null,
      type: getRandomElement([
        'booking_created', 'booking_confirmed', 'booking_cancelled', 'booking_completed',
        'mess_subscription', 'mess_cancelled', 'service_order', 'service_confirmed',
        'service_completed', 'payment_success', 'payment_failed', 'wallet_recharged',
        'review_received', 'message_received', 'verification_approved', 'verification_rejected',
        'system_announcement', 'reminder', 'referral_bonus'
      ]),
      title: getRandomElement([
        'Booking Confirmed', 'Payment Successful', 'New Message', 'Service Completed',
        'Review Received', 'Verification Approved', 'System Update', 'Reminder'
      ]),
      message: getRandomElement([
        'Your booking has been confirmed successfully.',
        'Payment of ₹500 has been processed.',
        'You have received a new message.',
        'Your service order has been completed.',
        'Thank you for your review!',
        'Your account has been verified.',
        'System maintenance scheduled for tonight.',
        'Don\'t forget to complete your profile.'
      ]),
      category: getRandomElement(['booking', 'mess', 'service', 'payment', 'system', 'communication']),
      priority: getRandomElement(['low', 'medium', 'high', 'urgent']),
      isRead: Math.random() > 0.4,
      isArchived: Math.random() > 0.8,
      actionRequired: Math.random() > 0.7
    };
    
    notifications.push(notification);
  }
  
  const savedNotifications = await Notification.insertMany(notifications);
  console.log(`Saved ${savedNotifications.length} notifications`);

  // Generate chat messages
  console.log('Generating chat messages...');
  const chatMessages = [];
  for (let i = 0; i < 50; i++) {
    const sender = getRandomElement(users);
    const receiver = getRandomElement(users.filter(u => u._id.toString() !== sender._id.toString()));
    
    const chatMessage = {
      sender: sender._id,
      receiver: receiver._id,
      message: getRandomElement([
        'Hello, is the room still available?',
        'What are the meal timings?',
        'Can I visit the property today?',
        'What is the security deposit amount?',
        'Are pets allowed?',
        'Is WiFi available?',
        'What are the house rules?',
        'Can I get a discount for long term stay?',
        'Is the location near to college?',
        'What amenities are included?'
      ]),
      messageType: getRandomElement(['text', 'image', 'file']),
      isRead: Math.random() > 0.3,
      isDeleted: false
    };
    
    chatMessages.push(chatMessage);
  }
  
  const savedChatMessages = await ChatMessage.insertMany(chatMessages);
  console.log(`Saved ${savedChatMessages.length} chat messages`);

  console.log('Additional entities generation completed!');
  console.log(`Total additional records created:`);
  console.log(`- Bookings: ${savedBookings.length}`);
  console.log(`- Mess Subscriptions: ${savedSubscriptions.length}`);
  console.log(`- Service Orders: ${savedServiceOrders.length}`);
  console.log(`- Transactions: ${savedTransactions.length}`);
  console.log(`- Reviews: ${savedReviews.length}`);
  console.log(`- Notifications: ${savedNotifications.length}`);
  console.log(`- Chat Messages: ${savedChatMessages.length}`);
}

// Run the script
if (require.main === module) {
  generateAllMockData();
}

module.exports = { generateAllMockData };
