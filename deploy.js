#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 RoomNMeal Deployment Script');
console.log('==============================\n');

const deploymentOptions = {
  1: 'Vercel (Frontend) + Railway (Backend)',
  2: 'Netlify (Frontend) + Render (Backend)',
  3: 'Heroku (Full Stack)',
  4: 'DigitalOcean App Platform'
};

const showOptions = () => {
  console.log('Choose your deployment platform:');
  Object.entries(deploymentOptions).forEach(([key, value]) => {
    console.log(`${key}. ${value}`);
  });
};

const deployVercelRailway = () => {
  console.log('\n🎯 Deploying to Vercel + Railway...');
  
  try {
    // Check if Vercel CLI is installed
    console.log('📦 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
    
    console.log('📦 Installing Railway CLI...');
    execSync('npm install -g @railway/cli', { stdio: 'inherit' });
    
    console.log('\n✅ CLIs installed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: cd client && vercel');
    console.log('2. Run: cd server && railway login');
    console.log('3. Run: cd server && railway up');
    console.log('4. Configure environment variables in both platforms');
    
  } catch (error) {
    console.error('❌ Deployment setup failed:', error.message);
  }
};

const deployHeroku = () => {
  console.log('\n🎯 Deploying to Heroku...');
  
  try {
    // Check if Heroku CLI is installed
    console.log('📦 Installing Heroku CLI...');
    execSync('npm install -g heroku', { stdio: 'inherit' });
    
    console.log('\n✅ Heroku CLI installed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: heroku login');
    console.log('2. Run: heroku create roomnmeal-app');
    console.log('3. Run: heroku config:set MONGODB_URI=your-atlas-uri');
    console.log('4. Run: git push heroku master');
    
  } catch (error) {
    console.error('❌ Heroku setup failed:', error.message);
  }
};

const deployNetlifyRender = () => {
  console.log('\n🎯 Deploying to Netlify + Render...');
  
  try {
    console.log('📦 Building frontend...');
    execSync('cd client && npm run build', { stdio: 'inherit' });
    
    console.log('\n✅ Frontend built successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Upload client/build folder to Netlify');
    console.log('2. Connect GitHub repo to Render');
    console.log('3. Configure build settings in Render');
    console.log('4. Set environment variables in Render');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
  }
};

const deployDigitalOcean = () => {
  console.log('\n🎯 Deploying to DigitalOcean App Platform...');
  
  console.log('\n📋 Manual steps required:');
  console.log('1. Create DigitalOcean account');
  console.log('2. Create new app in App Platform');
  console.log('3. Connect your GitHub repository');
  console.log('4. Configure build settings for both frontend and backend');
  console.log('5. Set environment variables');
};

const main = async () => {
  showOptions();
  
  // For now, let's default to Vercel + Railway as it's the most straightforward
  console.log('\n🎯 Recommended: Vercel + Railway (Option 1)');
  console.log('This combination offers:');
  console.log('✅ Free hosting for both frontend and backend');
  console.log('✅ Automatic deployments from GitHub');
  console.log('✅ Easy environment variable management');
  console.log('✅ Good performance and reliability');
  
  deployVercelRailway();
};

// Run if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { 
  deployVercelRailway, 
  deployHeroku, 
  deployNetlifyRender, 
  deployDigitalOcean 
}; 