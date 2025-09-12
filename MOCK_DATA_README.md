# Mock Data Generator for RoomNMeal

This script generates comprehensive mock data for all entities in the RoomNMeal application, with at least 30 records for each entity type.

## Generated Data

The mock data generator creates the following entities with realistic data:

### Users (50 records)
- **Students** (20): With college details, course information, emergency contacts
- **Hosts** (15): With property details, amenities, rules, and documents
- **Mess Providers** (10): With mess details, cuisine types, meal plans
- **Admins** (5): System administrators

### Rooms (40 records)
- Various property types: PG, Hostel, Apartment, House
- Different room types: Single, Double, Triple, Quad
- Realistic pricing and amenities
- Location data with coordinates
- Availability and booking information

### Mess Plans (35 records)
- Weekly and monthly plans
- Different cuisines: North Indian, South Indian, Gujarati, etc.
- Meal types: Breakfast, Lunch, Dinner
- Pricing and capacity information
- Menu details and meal timings

### Services (40 records)
- Service types: Laundry, Cleaning, Food, Transport, Maintenance
- Different categories and pricing models
- Availability schedules and location data
- Professional features and requirements

### Additional Entities
- **Bookings** (30): Room bookings with various statuses
- **Mess Subscriptions** (25): Student mess subscriptions
- **Service Orders** (35): Service bookings and orders
- **Transactions** (50): Payment and wallet transactions
- **Reviews** (40): User reviews for rooms and mess plans
- **Notifications** (60): System and user notifications
- **Chat Messages** (50): Communication between users

## How to Use

### Prerequisites
1. Make sure MongoDB is running (local or Atlas)
2. Set up your environment variables in `.env` file
3. Install dependencies: `npm install`

### Running the Mock Data Generator

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Run the mock data generator:**
   ```bash
   npm run mock-data
   ```

   Or directly:
   ```bash
   node run-mock-data.js
   ```

### What the Script Does

1. **Connects to MongoDB** using the connection string from environment variables
2. **Clears existing data** from all collections (be careful in production!)
3. **Generates mock data** for all entities with realistic relationships
4. **Saves data to database** in the correct order to maintain referential integrity
5. **Displays progress** and final statistics

### Environment Variables Required

Make sure your `.env` file contains:
```env
MONGODB_URI=mongodb://localhost:27017/roomnmeal
# or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roomnmeal
```

## Data Characteristics

### Realistic Data
- **Names**: Indian names for authenticity
- **Colleges**: Real Indian universities and colleges
- **Cities**: Major Indian cities with proper state information
- **Pricing**: Realistic pricing ranges for different services
- **Dates**: Proper date ranges for bookings and subscriptions

### Relationships
- Users are properly linked to their created rooms, mess plans, and services
- Bookings link students to rooms and hosts
- Subscriptions link students to mess plans
- Service orders link customers to service providers
- All foreign key relationships are maintained

### Variety
- Different user roles with appropriate data
- Various property types and room configurations
- Multiple cuisines and meal options
- Different service categories and pricing models
- Realistic status distributions for bookings and orders

## Customization

You can modify the mock data generator by editing `mock-data-generator.js`:

- **Change quantities**: Modify the loop counts (e.g., `for (let i = 0; i < 50; i++)`)
- **Add more data**: Extend the sample arrays (names, colleges, cities, etc.)
- **Modify relationships**: Adjust how entities are linked together
- **Change data patterns**: Modify the random data generation logic

## Safety Notes

⚠️ **Warning**: This script will **DELETE ALL EXISTING DATA** in your database before inserting mock data. 

- Only run this on development/test databases
- Never run on production databases with important data
- Make sure to backup your data before running if needed

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env` file
   - Ensure network connectivity for Atlas

2. **Memory Issues**
   - The script generates a lot of data
   - If you get memory errors, reduce the quantities in the script

3. **Validation Errors**
   - Check if all required fields are being generated
   - Verify data types match the schema requirements

### Getting Help

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your MongoDB connection
3. Ensure all dependencies are installed
4. Check that your environment variables are set correctly

## Sample Output

```
Starting mock data generation...
Connected to MongoDB
Clearing existing data...
Generating Users...
Generated 50 users
Saving users to database...
Saved 50 users
Generating Rooms...
Generated 40 rooms
Saving rooms to database...
Saved 40 rooms
...
Mock data generation completed successfully!
Total records created:
- Users: 50
- Rooms: 40
- Mess Plans: 35
- Services: 40
- Bookings: 30
- Mess Subscriptions: 25
- Service Orders: 35
- Transactions: 50
- Reviews: 40
- Notifications: 60
- Chat Messages: 50
```

This comprehensive mock data will help you test all features of the RoomNMeal application with realistic data scenarios.
