const mongoose = require('mongoose');
const { setupDatabase, optimizeDatabase } = require('./utils/databaseSetup');

// Test database setup
async function testDatabaseSetup() {
  try {
    console.log('🧪 Testing database setup...');
    
    // Connect to MongoDB (use test database)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roomnmeal-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Test database setup
    await setupDatabase();
    console.log('✅ Database setup completed successfully');
    
    // Test database optimization
    await optimizeDatabase();
    console.log('✅ Database optimization completed successfully');
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabaseSetup();
}

module.exports = { testDatabaseSetup }; 