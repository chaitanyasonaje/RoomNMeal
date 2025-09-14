# RoomNMeal Maharashtra Database Seeder
Write-Host "🌱 RoomNMeal Maharashtra Database Seeder" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Check if MONGODB_URI is set
if (-not $env:MONGODB_URI) {
    Write-Host "❌ Error: MONGODB_URI environment variable is required" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set your MongoDB Atlas connection string:" -ForegroundColor Yellow
    Write-Host '`$env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database"' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or create a .env file with:" -ForegroundColor Yellow
    Write-Host "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "🚀 Starting database seeding..." -ForegroundColor Yellow
Write-Host ""

# Run the seeding script
node seed-atlas.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🧪 Running data verification..." -ForegroundColor Yellow
    node test-seed.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Seeding completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Your database now contains:" -ForegroundColor Cyan
        Write-Host "   • 50 Providers (5 per city)" -ForegroundColor White
        Write-Host "   • 200 Users (20 per city)" -ForegroundColor White
        Write-Host "   • 100 Mess Plans (10 per city)" -ForegroundColor White
        Write-Host "   • 100 Rooms (10 per city)" -ForegroundColor White
        Write-Host "   • 100 Services (10 per city)" -ForegroundColor White
        Write-Host ""
        Write-Host "🏙️ Cities: Mumbai, Pune, Nashik, Nagpur, Aurangabad," -ForegroundColor Cyan
        Write-Host "          Shirpur, Solapur, Kolhapur, Amravati, Thane" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Data verification failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Seeding failed" -ForegroundColor Red
    exit 1
}
