const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./server/models/User');
const MessPlan = require('./server/models/MessPlan');
const Room = require('./server/models/Room');
const Service = require('./server/models/Service');

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
    console.log('✅ Connected to MongoDB Atlas for testing');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

async function testSeededData() {
  try {
    console.log('🧪 Testing seeded data...\n');
    
    // Test providers
    const providers = await User.find({ role: 'messProvider' });
    console.log(`👥 Providers: ${providers.length}/50`);
    
    // Test users by role
    const students = await User.find({ role: 'student' });
    const hosts = await User.find({ role: 'host' });
    const admins = await User.find({ role: 'admin' });
    console.log(`👤 Students: ${students.length}`);
    console.log(`🏠 Hosts: ${hosts.length}`);
    console.log(`👑 Admins: ${admins.length}`);
    console.log(`👤 Total Users: ${students.length + hosts.length + admins.length + providers.length}/200`);
    
    // Test mess plans
    const messPlans = await MessPlan.find({});
    console.log(`🍽️ Mess Plans: ${messPlans.length}/100`);
    
    // Test rooms
    const rooms = await Room.find({});
    console.log(`🏠 Rooms: ${rooms.length}/100`);
    
    // Test services
    const services = await Service.find({});
    console.log(`🔧 Services: ${services.length}/100`);
    
    // Test by city
    const cities = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Shirpur', 'Solapur', 'Kolhapur', 'Amravati', 'Thane'];
    console.log('\n🏙️ Data by City:');
    for (const city of cities) {
      const cityProviders = await User.countDocuments({ role: 'messProvider', 'address.city': city });
      const cityUsers = await User.countDocuments({ 'address.city': city });
      const cityMessPlans = await MessPlan.countDocuments({ 'city.name': city });
      const cityRooms = await Room.countDocuments({ 'address.city.name': city });
      const cityServices = await Service.countDocuments({ 'location.city': city });
      
      console.log(`  ${city}: ${cityProviders}P, ${cityUsers}U, ${cityMessPlans}M, ${cityRooms}R, ${cityServices}S`);
    }
    
    // Test data integrity
    console.log('\n🔍 Data Integrity Tests:');
    
    // Check if all mess plans have valid providers
    const messPlansWithInvalidProviders = await MessPlan.find({
      provider: { $nin: providers.map(p => p._id) }
    });
    console.log(`✅ Mess Plans with valid providers: ${messPlans.length - messPlansWithInvalidProviders.length}/${messPlans.length}`);
    
    // Check if all rooms have valid hosts
    const roomsWithInvalidHosts = await Room.find({
      host: { $nin: providers.map(p => p._id) }
    });
    console.log(`✅ Rooms with valid hosts: ${rooms.length - roomsWithInvalidHosts.length}/${rooms.length}`);
    
    // Check if all services have valid providers
    const servicesWithInvalidProviders = await Service.find({
      provider: { $nin: providers.map(p => p._id) }
    });
    console.log(`✅ Services with valid providers: ${services.length - servicesWithInvalidProviders.length}/${services.length}`);
    
    // Check password hashing
    const usersWithPlainPasswords = await User.find({
      password: { $regex: /^Password123!$/ }
    });
    console.log(`✅ Users with hashed passwords: ${(students.length + hosts.length + admins.length + providers.length) - usersWithPlainPasswords.length}/${students.length + hosts.length + admins.length + providers.length}`);
    
    // Check Maharashtra state consistency
    const maharashtraUsers = await User.countDocuments({ 'address.state': 'Maharashtra' });
    const maharashtraMessPlans = await MessPlan.countDocuments({ 'city.state': 'Maharashtra' });
    const maharashtraRooms = await Room.countDocuments({ 'address.city.state': 'Maharashtra' });
    const maharashtraServices = await Service.countDocuments({ 'location.state': 'Maharashtra' });
    
    console.log(`✅ Maharashtra Users: ${maharashtraUsers}/${students.length + hosts.length + admins.length + providers.length}`);
    console.log(`✅ Maharashtra Mess Plans: ${maharashtraMessPlans}/${messPlans.length}`);
    console.log(`✅ Maharashtra Rooms: ${maharashtraRooms}/${rooms.length}`);
    console.log(`✅ Maharashtra Services: ${maharashtraServices}/${services.length}`);
    
    // Sample data verification
    console.log('\n📋 Sample Data:');
    const sampleProvider = providers[0];
    console.log(`  Sample Provider: ${sampleProvider.name} (${sampleProvider.address.city})`);
    
    const sampleMessPlan = messPlans[0];
    console.log(`  Sample Mess Plan: ${sampleMessPlan.planName} - ₹${sampleMessPlan.price}`);
    
    const sampleRoom = rooms[0];
    console.log(`  Sample Room: ${sampleRoom.title} - ₹${sampleRoom.rent}/month`);
    
    const sampleService = services[0];
    console.log(`  Sample Service: ${sampleService.name} - ₹${sampleService.price}`);
    
    console.log('\n🎉 Data verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Testing failed:', error);
  }
}

async function main() {
  try {
    await connectToDatabase();
    await testSeededData();
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the test
if (require.main === module) {
  main();
}

module.exports = { main };
