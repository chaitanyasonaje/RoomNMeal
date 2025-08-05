#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://chaitanyasonaje0205:Chaitanya@0205@cluster0.5fwe9d6.mongodb.net/roomnmeal?retryWrites=true&w=majority&appName=Cluster0

# Environment
NODE_ENV=development
PORT=5000

# JWT Configuration
JWT_SECRET=roomnmeal-super-secret-jwt-key-2024

# Client URL
CLIENT_URL=http://localhost:3000

# Payment Integration (Razorpay)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Database Configuration
MONGODB_POOL_SIZE=10
MONGODB_SERVER_SELECTION_TIMEOUT=5000

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

const createEnvFile = () => {
  try {
    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log(`📁 File location: ${envPath}`);
    console.log('\n🔗 MongoDB Atlas connection configured:');
    console.log('mongodb+srv://chaitanyasonaje0205:***@cluster0.5fwe9d6.mongodb.net/roomnmeal');
    
    console.log('\n📋 Next steps:');
    console.log('1. Test the connection: npm run migrate-atlas');
    console.log('2. Start the application: npm run dev');
    console.log('3. Update other environment variables as needed');
    
    console.log('\n🔒 Security notes:');
    console.log('- Keep your .env file secure and never commit it to version control');
    console.log('- Update JWT_SECRET with a strong random string');
    console.log('- Configure Razorpay keys for payment functionality');
    console.log('- Set up Cloudinary for image uploads');
    
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
};

// Run if this script is executed directly
if (require.main === module) {
  createEnvFile();
}

module.exports = { createEnvFile }; 