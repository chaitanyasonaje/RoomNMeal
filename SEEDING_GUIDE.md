# RoomNMeal Maharashtra Database Seeding Guide

This guide explains how to seed your RoomNMeal MongoDB Atlas database with a comprehensive Maharashtra-only dataset.

## 📊 Dataset Overview

The seeding script creates a large, diverse dataset with:

- **50 Providers** (5 per city across 10 major Maharashtra cities)
- **200 Users** (20 per city with various roles: student, host, messProvider, admin)
- **100 Mess Plans** (10 per city with realistic pricing and meal options)
- **100 Rooms** (10 per city with different types and amenities)
- **100 Services** (10 per city across various categories)

## 🏙️ Cities Covered

1. Mumbai
2. Pune
3. Nashik
4. Nagpur
5. Aurangabad
6. Shirpur
7. Solapur
8. Kolhapur
9. Amravati
10. Thane

## 🚀 Quick Start

### Prerequisites

1. **MongoDB Atlas Account**: Ensure you have a MongoDB Atlas cluster set up
2. **Connection String**: Get your MongoDB Atlas connection string
3. **Node.js**: Ensure Node.js is installed on your system

### Step 1: Set Environment Variable

Set your MongoDB Atlas connection string as an environment variable:

```bash
# Option 1: Export in terminal
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database"

# Option 2: Create .env file
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database" > .env
```

### Step 2: Run the Seeding Script

```bash
# Method 1: Direct execution
node seed-atlas.js

# Method 2: Using the run script
node run-seed.js

# Method 3: Make executable and run
chmod +x run-seed.js
./run-seed.js
```

## 📋 Data Structure

### Providers Collection
- **50 providers** (5 per city)
- Fields: `_id`, `name`, `email`, `phone`, `role: "messProvider"`, `state: "Maharashtra"`, `city`, `messDetails`
- All providers are verified and active
- Realistic Indian names and contact information

### Users Collection
- **200 users** (20 per city)
- Roles: `student`, `host`, `messProvider`, `admin` (randomly assigned)
- Fields: `_id`, `name`, `email`, `phone`, `role`, `password` (bcrypt hashed), `state: "Maharashtra"`, `city`
- Passwords are hashed using bcrypt with salt rounds of 10
- Student users have college details, host users have property details

### Mess Plans Collection
- **100 mess plans** (10 per city)
- Fields: `_id`, `provider`, `city`, `planName`, `description`, `planType`, `price`, `mealTypes`, `cuisine`, `capacity`
- Plan types: `weekly` (7 days) and `monthly` (30 days)
- Realistic pricing: ₹500-2500 for weekly, ₹2000-10000 for monthly
- Multiple cuisines: North Indian, South Indian, Maharashtrian, etc.

### Rooms Collection
- **100 rooms** (10 per city)
- Fields: `_id`, `host`, `title`, `description`, `propertyType`, `roomType`, `rent`, `address`, `amenities`
- Room types: `Single`, `Double`, `Triple`, `Quad`
- Property types: `PG`, `Hostel`, `Apartment`, `House`
- Realistic pricing: ₹5000-20000 per month
- 20+ amenities including WiFi, AC, parking, etc.

### Services Collection
- **100 services** (10 per city)
- Fields: `_id`, `provider`, `name`, `description`, `type`, `price`, `location`, `availability`
- Categories: `laundry`, `wifi`, `tiffin`, `housekeeping`, `tutor`, `bike-rental`, `cleaning`, `food`, `transport`, `maintenance`
- Realistic pricing: ₹50-550 per service
- Service radius: 5-15 km from provider location

## 🔧 Customization

### Modifying Data Volume

To change the number of records per city, modify these variables in `seed-atlas.js`:

```javascript
// Change from 5 to any number for providers per city
for (let j = 0; j < 5; j++) {

// Change from 20 to any number for users per city  
for (let j = 0; j < 20; j++) {

// Change from 10 to any number for mess plans per city
for (let j = 0; j < 10; j++) {

// Change from 10 to any number for rooms per city
for (let j = 0; j < 10; j++) {

// Change from 10 to any number for services per city
for (let j = 0; j < 10; j++) {
```

### Adding New Cities

To add more cities, update the `cities` array:

```javascript
const cities = [
  'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 
  'Shirpur', 'Solapur', 'Kolhapur', 'Amravati', 'Thane',
  'NewCity1', 'NewCity2' // Add your cities here
];
```

### Customizing Data

You can modify the sample data arrays to include your preferred names, amenities, cuisines, etc.:

```javascript
const firstNames = ['Your', 'Custom', 'Names'];
const amenities = ['Your', 'Custom', 'Amenities'];
const cuisines = ['Your', 'Custom', 'Cuisines'];
```

## 🛡️ Safety Features

- **Clear Collections**: Script clears existing data before seeding
- **Password Hashing**: All passwords are securely hashed using bcrypt
- **Validation**: Data follows MongoDB schema validation rules
- **Error Handling**: Comprehensive error handling and logging
- **Connection Management**: Proper database connection and cleanup

## 📈 Performance

- **Batch Operations**: Uses `insertMany()` for efficient bulk inserts
- **Memory Efficient**: Processes data in batches to avoid memory issues
- **Progress Tracking**: Real-time progress updates during seeding

## 🔍 Verification

After seeding, verify your data:

```javascript
// Check total counts
db.users.countDocuments({})
db.messplans.countDocuments({})
db.rooms.countDocuments({})
db.services.countDocuments({})

// Check by city
db.users.countDocuments({"address.city": "Mumbai"})
db.messplans.countDocuments({"city.name": "Mumbai"})

// Check by role
db.users.countDocuments({"role": "student"})
db.users.countDocuments({"role": "host"})
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify your MongoDB Atlas connection string
   - Check network connectivity
   - Ensure your IP is whitelisted in Atlas

2. **Memory Issues**
   - Reduce batch sizes in the script
   - Run on a machine with more RAM

3. **Validation Errors**
   - Check that all required fields are provided
   - Verify data types match schema requirements

### Getting Help

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your MongoDB Atlas cluster is running
3. Ensure all dependencies are installed (`npm install`)
4. Check that your connection string is correct

## 📝 Notes

- All generated data is realistic and follows Indian naming conventions
- Phone numbers are valid Indian mobile numbers
- Email addresses are properly formatted
- Coordinates are approximate for each city
- Images use placeholder URLs (Picsum)
- All timestamps are set to current time during seeding

## 🎯 Next Steps

After successful seeding:
1. Test your application with the new data
2. Verify all features work with the seeded data
3. Consider creating indexes for better query performance
4. Set up regular data backups

---

**Happy Seeding! 🌱**
