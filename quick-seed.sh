#!/bin/bash

echo "🌱 RoomNMeal Maharashtra Database Seeder"
echo "=========================================="
echo ""

# Check if MONGODB_URI is set
if [ -z "$MONGODB_URI" ]; then
    echo "❌ Error: MONGODB_URI environment variable is required"
    echo ""
    echo "Please set your MongoDB Atlas connection string:"
    echo "export MONGODB_URI=\"mongodb+srv://username:password@cluster.mongodb.net/database\""
    echo ""
    echo "Or create a .env file with:"
    echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database"
    echo ""
    exit 1
fi

echo "🚀 Starting database seeding..."
echo ""

# Run the seeding script
node seed-atlas.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🧪 Running data verification..."
    node test-seed.js
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Seeding completed successfully!"
        echo ""
        echo "📊 Your database now contains:"
        echo "   • 50 Providers (5 per city)"
        echo "   • 200 Users (20 per city)"
        echo "   • 100 Mess Plans (10 per city)"
        echo "   • 100 Rooms (10 per city)"
        echo "   • 100 Services (10 per city)"
        echo ""
        echo "🏙️ Cities: Mumbai, Pune, Nashik, Nagpur, Aurangabad,"
        echo "          Shirpur, Solapur, Kolhapur, Amravati, Thane"
    else
        echo "❌ Data verification failed"
        exit 1
    fi
else
    echo "❌ Seeding failed"
    exit 1
fi
