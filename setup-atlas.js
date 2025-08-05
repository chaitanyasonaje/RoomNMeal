#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗄️  MongoDB Atlas Setup for RoomNMeal');
console.log('=====================================\n');

const questions = [
  {
    name: 'clusterName',
    question: 'Enter your Atlas cluster name (e.g., roomnmeal-cluster): ',
    default: 'roomnmeal-cluster'
  },
  {
    name: 'username',
    question: 'Enter database username (e.g., roomnmeal_user): ',
    default: 'roomnmeal_user'
  },
  {
    name: 'password',
    question: 'Enter database password: ',
    secret: true
  },
  {
    name: 'clusterUrl',
    question: 'Enter your Atlas cluster URL (e.g., cluster.xxxxx.mongodb.net): ',
    default: 'cluster.xxxxx.mongodb.net'
  },
  {
    name: 'environment',
    question: 'Environment (development/production): ',
    default: 'development'
  }
];

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question.question, (answer) => {
      resolve(answer || question.default);
    });
  });
};

const generateConnectionString = (answers) => {
  return `mongodb+srv://${answers.username}:${answers.password}@${answers.clusterUrl}/roomnmeal?retryWrites=true&w=majority`;
};

const createEnvFile = (connectionString, environment) => {
  const envContent = `# MongoDB Atlas Configuration
MONGODB_URI=${connectionString}

# Environment
NODE_ENV=${environment}
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

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
`;

  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, envContent);
  return envPath;
};

const main = async () => {
  try {
    console.log('📋 Please provide the following information:\n');
    
    const answers = {};
    
    for (const question of questions) {
      answers[question.name] = await askQuestion(question);
    }
    
    console.log('\n🔧 Generating configuration...');
    
    // Generate connection string
    const connectionString = generateConnectionString(answers);
    
    // Create .env file
    const envPath = createEnvFile(connectionString, answers.environment);
    
    console.log('\n✅ Configuration completed!');
    console.log(`📁 Environment file created: ${envPath}`);
    console.log(`🔗 Connection string: ${connectionString.replace(answers.password, '***')}`);
    
    console.log('\n📋 Next steps:');
    console.log('1. Verify your Atlas cluster is running');
    console.log('2. Ensure your IP is whitelisted in Atlas');
    console.log('3. Test the connection: npm run migrate-atlas');
    console.log('4. Start the application: npm run dev');
    
    console.log('\n🔒 Security notes:');
    console.log('- Keep your .env file secure and never commit it to version control');
    console.log('- Use strong passwords for database users');
    console.log('- Whitelist only necessary IP addresses in production');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
};

// Run setup if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { main }; 