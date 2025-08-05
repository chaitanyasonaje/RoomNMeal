const mongoose = require('mongoose');
const { setupDatabase, optimizeDatabase } = require('../utils/databaseSetup');
require('dotenv').config();

const migrateToAtlas = async () => {
  try {
    console.log('🚀 Starting migration to MongoDB Atlas...');
    
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    console.log('📡 Connecting to MongoDB Atlas...');
    
    // Connect to Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    
    // Setup database indexes and optimizations
    console.log('🔧 Setting up database indexes and optimizations...');
    await setupDatabase();
    await optimizeDatabase();
    
    console.log('✅ Database setup completed successfully');
    
    // Test database operations
    console.log('🧪 Testing database operations...');
    await testDatabaseOperations();
    
    console.log('🎉 Migration to MongoDB Atlas completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with the Atlas connection string');
    console.log('2. Test your application with the new database');
    console.log('3. Monitor performance in Atlas dashboard');
    console.log('4. Set up alerts and monitoring');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

const testDatabaseOperations = async () => {
  try {
    // Test basic database operations
    const db = mongoose.connection.db;
    
    // Test collection creation
    const testCollection = db.collection('migration_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Migration test successful'
    });
    
    // Test query operations
    const result = await testCollection.findOne({ test: true });
    if (!result) {
      throw new Error('Database query test failed');
    }
    
    // Clean up test data
    await testCollection.deleteOne({ test: true });
    
    console.log('✅ Database operations test passed');
    
  } catch (error) {
    console.error('❌ Database operations test failed:', error.message);
    throw error;
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToAtlas();
}

module.exports = { migrateToAtlas }; 