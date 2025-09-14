#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🌱 RoomNMeal Maharashtra Database Seeder');
console.log('==========================================\n');

// Check if MONGODB_URI is set
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  console.error('❌ Error: MONGODB_URI environment variable is required');
  console.log('\nPlease set your MongoDB Atlas connection string:');
  console.log('export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database"');
  console.log('\nOr create a .env file with:');
  console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
  process.exit(1);
}

// Run the seeding script
const seedScript = path.join(__dirname, 'seed-atlas.js');
const command = `node "${seedScript}"`;

console.log('🚀 Starting database seeding...\n');

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
  
  if (stderr) {
    console.error('⚠️  Warnings:', stderr);
  }
  
  console.log(stdout);
  console.log('\n🎉 Seeding completed successfully!');
});
