const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./server/models/User');
const MessPlan = require('./server/models/MessPlan');
const Room = require('./server/models/Room');
const Service = require('./server/models/Service');

// Maharashtra cities
const cities = [
  'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 
  'Shirpur', 'Solapur', 'Kolhapur', 'Amravati', 'Thane'
];

// Sample data arrays
const firstNames = [
  'Aarav', 'Aditya', 'Akshay', 'Amit', 'Ankit', 'Arjun', 'Bhavesh', 'Chirag', 'Deepak', 'Gaurav',
  'Harsh', 'Ishaan', 'Jay', 'Karan', 'Laksh', 'Manish', 'Nikhil', 'Omkar', 'Pranav', 'Rahul',
  'Sagar', 'Tushar', 'Uday', 'Vikram', 'Yash', 'Zain', 'Aisha', 'Bhavya', 'Chaya', 'Deepika',
  'Esha', 'Fatima', 'Gayatri', 'Hema', 'Isha', 'Jyoti', 'Kavya', 'Lakshmi', 'Meera', 'Neha',
  'Priya', 'Radha', 'Sneha', 'Tara', 'Uma', 'Vidya', 'Yamini', 'Zara'
];

const lastNames = [
  'Sharma', 'Patil', 'Deshmukh', 'Jadhav', 'Kulkarni', 'Joshi', 'Pawar', 'More', 'Bhosale', 'Gaikwad',
  'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Jain', 'Mehta', 'Shah', 'Patel', 'Reddy', 'Nair',
  'Iyer', 'Menon', 'Pillai', 'Nair', 'Krishnan', 'Raman', 'Sundaram', 'Venkatesh', 'Raghavan', 'Srinivasan'
];

const providerNames = [
  'Maharashtra Mess', 'Pune Food Hub', 'Mumbai Kitchen', 'Nashik Delights', 'Nagpur Spice',
  'Aurangabad Tiffin', 'Shirpur Home Food', 'Solapur Mess', 'Kolhapur Kitchen', 'Amravati Meals',
  'Thane Food Center', 'Mumbai Mess House', 'Pune Tiffin Center', 'Nashik Food Corner', 'Nagpur Mess',
  'Aurangabad Kitchen', 'Shirpur Food Hub', 'Solapur Mess House', 'Kolhapur Tiffin', 'Amravati Kitchen',
  'Thane Mess Center', 'Mumbai Food Palace', 'Pune Kitchen Hub', 'Nashik Mess Corner', 'Nagpur Food House',
  'Aurangabad Mess', 'Shirpur Kitchen', 'Solapur Food Center', 'Kolhapur Mess House', 'Amravati Food Hub',
  'Thane Kitchen', 'Mumbai Tiffin Hub', 'Pune Mess Palace', 'Nashik Food House', 'Nagpur Kitchen Corner',
  'Aurangabad Food Center', 'Shirpur Mess Hub', 'Solapur Kitchen House', 'Kolhapur Food Palace', 'Amravati Mess Hub',
  'Thane Food Palace', 'Mumbai Kitchen Hub', 'Pune Food Corner', 'Nashik Mess Palace', 'Nagpur Tiffin Hub',
  'Aurangabad Kitchen House', 'Shirpur Food Palace', 'Solapur Mess Hub', 'Kolhapur Kitchen Center', 'Amravati Food Palace'
];

const roomTitles = [
  'Cozy Single Room', 'Spacious Double Room', 'Shared Accommodation', 'Studio Apartment', 'Premium Room',
  'Budget Friendly Room', 'Luxury Suite', 'Standard Room', 'Deluxe Room', 'Executive Room',
  'Modern Single Room', 'Comfortable Double', 'Shared Living Space', 'Compact Studio', 'Elegant Room',
  'Affordable Room', 'High-end Suite', 'Basic Room', 'Upgraded Room', 'Business Room'
];

const serviceNames = [
  'Laundry Service', 'WiFi Setup', 'Tiffin Delivery', 'Housekeeping', 'Tutoring Service',
  'Bike Rental', 'Cleaning Service', 'Food Delivery', 'Maintenance', 'Transport Service',
  'Washing Service', 'Internet Service', 'Meal Service', 'Room Cleaning', 'Study Support',
  'Vehicle Rental', 'Deep Cleaning', 'Catering Service', 'Repair Service', 'Cab Service'
];

const amenities = [
  'WiFi', 'AC', 'Fan', 'Bed', 'Wardrobe', 'Study Table', 'Chair', 'Mirror', 'Geyser', 'Washing Machine',
  'Refrigerator', 'Microwave', 'TV', 'Parking', 'Security', 'CCTV', 'Power Backup', 'Water Purifier',
  'Common Room', 'Garden', 'Balcony', 'Lift', 'Housekeeping', 'Laundry', 'Meals', 'Tiffin Service'
];

const cuisines = [
  'North Indian', 'South Indian', 'Maharashtrian', 'Gujarati', 'Punjabi', 'Rajasthani', 'Bengali',
  'Jain', 'Vegetarian', 'Non-Vegetarian', 'Continental', 'Chinese', 'Italian', 'Mexican'
];

const mealTypes = ['breakfast', 'lunch', 'dinner'];

const serviceCategories = [
  'laundry', 'wifi', 'tiffin', 'housekeeping', 'tutor', 'bike-rental', 'cleaning', 'food', 'transport', 'maintenance'
];

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePhoneNumber() {
  const prefixes = ['91', '92', '93', '94', '95', '96', '97', '98', '99'];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${number}`;
}

function generateEmail(name, city) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com'];
  const domain = getRandomElement(domains);
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  const randomNum = Math.floor(Math.random() * 1000);
  return `${cleanName}${randomNum}@${domain}`;
}

function generatePincode() {
  return Math.floor(400000 + Math.random() * 200000).toString();
}

function generateCoordinates(city) {
  // Approximate coordinates for Maharashtra cities
  const cityCoords = {
    'Mumbai': [19.0760, 72.8777],
    'Pune': [18.5204, 73.8567],
    'Nashik': [19.9975, 73.7898],
    'Nagpur': [21.1458, 79.0882],
    'Aurangabad': [19.8762, 75.3433],
    'Shirpur': [21.3500, 74.8800],
    'Solapur': [17.6599, 75.9064],
    'Kolhapur': [16.7050, 74.2433],
    'Amravati': [20.9374, 77.7796],
    'Thane': [19.2183, 72.9781]
  };
  
  const base = cityCoords[city] || [19.0760, 72.8777];
  return {
    latitude: base[0] + (Math.random() - 0.5) * 0.1,
    longitude: base[1] + (Math.random() - 0.5) * 0.1
  };
}

async function connectToDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

async function clearCollections() {
  console.log('🧹 Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    MessPlan.deleteMany({}),
    Room.deleteMany({}),
    Service.deleteMany({})
  ]);
  console.log('✅ Collections cleared');
}

async function createProviders() {
  console.log('👥 Creating providers...');
  const providers = [];
  
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    
    for (let j = 0; j < 5; j++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const name = `${firstName} ${lastName}`;
      
      const provider = new User({
        name: name,
        email: generateEmail(name, city),
        password: 'Password123!', // Will be hashed by pre-save middleware
        phone: generatePhoneNumber(),
        role: 'messProvider',
        isVerified: true,
        isActive: true,
        address: {
          city: city,
          state: 'Maharashtra',
          pincode: generatePincode()
        },
        messDetails: {
          messName: getRandomElement(providerNames),
          cuisine: getRandomElements(cuisines, Math.floor(Math.random() * 3) + 1),
          mealTypes: getRandomElements(mealTypes, Math.floor(Math.random() * 3) + 1),
          capacity: Math.floor(Math.random() * 50) + 20,
          hygieneRating: Math.floor(Math.random() * 2) + 4
        }
      });
      
      providers.push(provider);
    }
  }
  
  const savedProviders = await User.insertMany(providers);
  console.log(`✅ Created ${savedProviders.length} providers`);
  return savedProviders;
}

async function createUsers(providers) {
  console.log('👤 Creating users...');
  const users = [];
  const roles = ['student', 'host', 'messProvider', 'admin'];
  
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    
    for (let j = 0; j < 20; j++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const name = `${firstName} ${lastName}`;
      const role = getRandomElement(roles);
      
      const user = new User({
        name: name,
        email: generateEmail(name, city),
        password: 'Password123!', // Will be hashed by pre-save middleware
        phone: generatePhoneNumber(),
        role: role,
        isVerified: true,
        isActive: true,
        address: {
          city: city,
          state: 'Maharashtra',
          pincode: generatePincode()
        },
        studentDetails: role === 'student' ? {
          college: `${city} University`,
          course: getRandomElement(['Engineering', 'Medicine', 'Commerce', 'Arts', 'Science']),
          year: Math.floor(Math.random() * 4) + 1,
          studentId: `STU${Math.floor(Math.random() * 10000)}`
        } : undefined,
        hostDetails: role === 'host' ? {
          propertyType: getRandomElement(['PG', 'Hostel', 'Apartment', 'House']),
          totalRooms: Math.floor(Math.random() * 10) + 5,
          availableRooms: Math.floor(Math.random() * 5) + 1,
          amenities: getRandomElements(amenities, Math.floor(Math.random() * 8) + 3)
        } : undefined
      });
      
      users.push(user);
    }
  }
  
  const savedUsers = await User.insertMany(users);
  console.log(`✅ Created ${savedUsers.length} users`);
  return savedUsers;
}

async function createMessPlans(providers) {
  console.log('🍽️ Creating mess plans...');
  const messPlans = [];
  
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const cityProviders = providers.filter(p => p.address.city === city);
    
    for (let j = 0; j < 10; j++) {
      const provider = getRandomElement(cityProviders);
      const planTypes = ['daily', 'weekly', 'monthly'];
      const planType = getRandomElement(planTypes);
      const duration = planType === 'daily' ? 1 : planType === 'weekly' ? 7 : 30;
      
      const messPlan = new MessPlan({
        provider: provider._id,
        city: {
          id: city.toLowerCase(),
          name: city,
          state: 'Maharashtra'
        },
        planName: `${provider.messDetails.messName} - ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
        description: `Delicious ${getRandomElement(cuisines)} cuisine with fresh ingredients and hygienic preparation`,
        planType: planType,
        duration: duration,
        price: planType === 'daily' ? Math.floor(Math.random() * 200) + 100 : 
               planType === 'weekly' ? Math.floor(Math.random() * 2000) + 500 : 
               Math.floor(Math.random() * 8000) + 2000,
        mealTypes: getRandomElements(mealTypes, Math.floor(Math.random() * 3) + 1),
        cuisine: getRandomElements(cuisines, Math.floor(Math.random() * 3) + 1),
        dietaryOptions: getRandomElements(['Vegetarian', 'Non-Vegetarian', 'Jain'], Math.floor(Math.random() * 2) + 1),
        menu: {
          breakfast: ['Poha', 'Upma', 'Idli', 'Paratha', 'Bread Butter'],
          lunch: ['Dal Rice', 'Sabzi', 'Roti', 'Curry', 'Salad'],
          dinner: ['Dal Rice', 'Sabzi', 'Roti', 'Curry', 'Dessert']
        },
        mealTimings: {
          breakfast: '8:00 AM',
          lunch: '1:00 PM',
          dinner: '8:00 PM'
        },
        capacity: Math.floor(Math.random() * 30) + 10,
        currentSubscribers: Math.floor(Math.random() * 15),
        hygieneRating: Math.floor(Math.random() * 2) + 4,
        isActive: true,
        isVerified: true,
        images: [`https://picsum.photos/400/300?random=${Math.random()}`],
        features: ['Home-cooked', 'Fresh ingredients', 'Hygienic preparation', 'Flexible timings'],
        cancellationPolicy: 'No refund after subscription starts'
      });
      
      messPlans.push(messPlan);
    }
  }
  
  const savedMessPlans = await MessPlan.insertMany(messPlans);
  console.log(`✅ Created ${savedMessPlans.length} mess plans`);
  return savedMessPlans;
}

async function createRooms(providers) {
  console.log('🏠 Creating rooms...');
  const rooms = [];
  
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const cityProviders = providers.filter(p => p.address.city === city);
    
    for (let j = 0; j < 10; j++) {
      const provider = getRandomElement(cityProviders);
      const roomTypes = ['single', 'double', 'shared', 'studio'];
      const propertyTypes = ['PG', 'Hostel', 'Apartment', 'House'];
      const roomType = getRandomElement(roomTypes);
      const propertyType = getRandomElement(propertyTypes);
      
      const coordinates = generateCoordinates(city);
      
      const room = new Room({
        host: provider._id,
        title: getRandomElement(roomTitles),
        description: `Comfortable ${roomType.toLowerCase()} room in ${propertyType.toLowerCase()} with all modern amenities`,
        propertyType: propertyType,
        roomType: roomType,
        rent: Math.floor(Math.random() * 15000) + 5000,
        securityDeposit: Math.floor(Math.random() * 10000) + 5000,
        address: {
          street: `${Math.floor(Math.random() * 100)} Street`,
          city: {
            id: city.toLowerCase(),
            name: city,
            state: 'Maharashtra'
          },
          pincode: generatePincode(),
          coordinates: coordinates
        },
        nearbyColleges: [
          { name: `${city} University`, distance: Math.floor(Math.random() * 5) + 1 },
          { name: `${city} Engineering College`, distance: Math.floor(Math.random() * 3) + 1 }
        ],
        amenities: getRandomElements(amenities, Math.floor(Math.random() * 10) + 5),
        rules: [
          'No smoking',
          'No pets',
          'No loud music after 10 PM',
          'Keep room clean',
          'No overnight guests'
        ],
        images: [
          `https://picsum.photos/400/300?random=${Math.random()}`,
          `https://picsum.photos/400/300?random=${Math.random()}`,
          `https://picsum.photos/400/300?random=${Math.random()}`
        ],
        availability: {
          isAvailable: Math.random() > 0.2,
          totalRooms: Math.floor(Math.random() * 5) + 1,
          occupiedRooms: Math.floor(Math.random() * 3)
        },
        mealOptions: {
          hasMeals: Math.random() > 0.5,
          mealTypes: getRandomElements(mealTypes, Math.floor(Math.random() * 3) + 1),
          mealPrice: {
            breakfast: Math.floor(Math.random() * 100) + 50,
            lunch: Math.floor(Math.random() * 150) + 100,
            dinner: Math.floor(Math.random() * 150) + 100
          }
        },
        additionalServices: {
          laundry: { available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 20 },
          tea: { available: Math.random() > 0.5, price: Math.floor(Math.random() * 20) + 10 }
        },
        isVerified: Math.random() > 0.2,
        isActive: true,
        views: Math.floor(Math.random() * 100)
      });
      
      rooms.push(room);
    }
  }
  
  const savedRooms = await Room.insertMany(rooms);
  console.log(`✅ Created ${savedRooms.length} rooms`);
  return savedRooms;
}

async function createServices(providers) {
  console.log('🔧 Creating services...');
  const services = [];
  
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const cityProviders = providers.filter(p => p.address.city === city);
    
    for (let j = 0; j < 10; j++) {
      const provider = getRandomElement(cityProviders);
      const serviceName = getRandomElement(serviceNames);
      const category = getRandomElement(serviceCategories);
      const coordinates = generateCoordinates(city);
      
      const service = new Service({
        name: serviceName,
        type: category,
        provider: provider._id,
        description: `Professional ${serviceName.toLowerCase()} with quality service and timely delivery`,
        price: Math.floor(Math.random() * 500) + 50,
        contact: generatePhoneNumber(),
        priceType: getRandomElement(['per_item', 'per_kg', 'per_meal', 'per_trip', 'per_hour', 'fixed']),
        duration: getRandomElement(['1 hour', '2 hours', '30 minutes', '1 day', '2 days', '1 week']),
        availability: {
          days: getRandomElements(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], Math.floor(Math.random() * 5) + 3),
          timeSlots: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' }
          ],
          isAvailable: Math.random() > 0.1
        },
        location: {
          address: `${Math.floor(Math.random() * 100)} Street, ${city}`,
          city: city,
          state: 'Maharashtra',
          pincode: generatePincode(),
          coordinates: {
            lat: coordinates.latitude,
            lng: coordinates.longitude
          },
          serviceRadius: Math.floor(Math.random() * 10) + 5
        },
        features: [
          { name: 'Quality Service', description: 'High quality service', included: true },
          { name: 'Timely Delivery', description: 'On-time service', included: true },
          { name: 'Professional Staff', description: 'Trained professionals', included: true }
        ],
        images: [`https://picsum.photos/400/300?random=${Math.random()}`],
        isVerified: Math.random() > 0.2,
        isActive: true,
        isFeatured: Math.random() > 0.8,
        maxOrders: Math.floor(Math.random() * 50) + 10,
        currentOrders: Math.floor(Math.random() * 20),
        tags: [category, city.toLowerCase(), 'maharashtra'],
        category: category,
        subcategory: getRandomElement(['basic', 'premium', 'standard', 'deluxe']),
        requirements: ['Valid ID', 'Contact number', 'Service address'],
        cancellationPolicy: getRandomElement(['flexible', 'moderate', 'strict']),
        refundPolicy: 'Full refund if cancelled 24 hours before service',
        terms: 'Service terms and conditions apply'
      });
      
      services.push(service);
    }
  }
  
  const savedServices = await Service.insertMany(services);
  console.log(`✅ Created ${savedServices.length} services`);
  return savedServices;
}

async function main() {
  try {
    console.log('🚀 Starting RoomNMeal Maharashtra Database Seeding...\n');
    
    await connectToDatabase();
    await clearCollections();
    
    const providers = await createProviders();
    const users = await createUsers(providers);
    const messPlans = await createMessPlans(providers);
    const rooms = await createRooms(providers);
    const services = await createServices(providers);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`👥 Providers: ${providers.length}`);
    console.log(`👤 Users: ${users.length}`);
    console.log(`🍽️ Mess Plans: ${messPlans.length}`);
    console.log(`🏠 Rooms: ${rooms.length}`);
    console.log(`🔧 Services: ${services.length}`);
    console.log(`\n✅ Maharashtra dataset seeding completed successfully!`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding script
if (require.main === module) {
  main();
}

module.exports = { main };
