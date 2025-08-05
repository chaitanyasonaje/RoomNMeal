# 🗄️ MongoDB Atlas Setup Guide - RoomNMeal

This guide will help you set up MongoDB Atlas for the RoomNMeal project, from cluster creation to production deployment.

## 🚀 Step-by-Step Atlas Setup

### 1. Create MongoDB Atlas Account

1. **Sign Up**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Account**: Sign up with your email or Google account
3. **Choose Plan**: Select the free tier (M0) for development or paid plans for production

### 2. Create Your First Cluster

#### Cluster Configuration
1. **Cloud Provider**: Choose AWS, Google Cloud, or Azure
2. **Region**: Select the region closest to your users (e.g., Mumbai for India)
3. **Cluster Tier**: 
   - **Free Tier (M0)**: 512MB storage, shared RAM (development)
   - **M10**: 2GB storage, dedicated RAM (production)
   - **M20+**: Higher tiers for production workloads

#### Cluster Settings
```
Cluster Name: roomnmeal-cluster
Database Version: 7.0 (latest)
Backup: Enabled (recommended)
```

### 3. Database Access Setup

#### Create Database User
1. Go to **Database Access** in the left sidebar
2. Click **"Add New Database User"**
3. Configure user:
   ```
   Username: roomnmeal_user
   Password: [generate strong password]
   User Privileges: Atlas admin (for development)
   ```

#### Security Best Practices
```javascript
// For production, use specific privileges:
{
  "role": "readWrite",
  "db": "roomnmeal"
}
```

### 4. Network Access Configuration

#### IP Whitelist
1. Go to **Network Access** in the left sidebar
2. Click **"Add IP Address"**
3. Options:
   - **Allow Access from Anywhere**: `0.0.0.0/0` (development only)
   - **Current IP Address**: Your current IP
   - **Custom IP**: Specific IP addresses

#### Production Security
```bash
# For production, whitelist only your server IPs
# Example: AWS EC2 IP ranges
52.0.0.0/8
54.0.0.0/8
```

### 5. Get Connection String

#### Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

#### Atlas Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace placeholders:
   ```
   mongodb+srv://roomnmeal_user:your_password@roomnmeal-cluster.xxxxx.mongodb.net/roomnmeal?retryWrites=true&w=majority
   ```

## 🔧 Environment Configuration

### 1. Update Environment Variables

#### Development (.env)
```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://roomnmeal_user:your_password@roomnmeal-cluster.xxxxx.mongodb.net/roomnmeal?retryWrites=true&w=majority

# Other configurations
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000

# Payment Integration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### Production (.env)
```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://roomnmeal_user:your_production_password@roomnmeal-cluster.xxxxx.mongodb.net/roomnmeal?retryWrites=true&w=majority

# Production settings
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-super-secret-jwt-key
CLIENT_URL=https://yourdomain.com

# Payment Integration
RAZORPAY_KEY_ID=your-production-razorpay-key-id
RAZORPAY_KEY_SECRET=your-production-razorpay-key-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 2. Update Server Configuration

The server is already configured to use the `MONGODB_URI` environment variable:

```javascript
// server/server.js
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roomnmeal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB Atlas');
  // Database setup continues...
})
.catch(err => console.error('MongoDB Atlas connection error:', err));
```

## 🛡️ Security Configuration

### 1. Database Security

#### User Privileges
```javascript
// Development (Atlas admin)
{
  "role": "atlasAdmin",
  "database": "admin"
}

// Production (specific privileges)
{
  "role": "readWrite",
  "database": "roomnmeal"
}
```

#### Network Security
```bash
# Development: Allow all IPs
0.0.0.0/0

# Production: Whitelist specific IPs
# Your server IP addresses only
```

### 2. Connection Security

#### SSL/TLS Configuration
```javascript
// Atlas automatically uses SSL/TLS
// No additional configuration needed
```

#### Connection Options
```javascript
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Atlas-specific options
  ssl: true,
  sslValidate: true,
  retryWrites: true,
  w: 'majority'
});
```

## 📊 Monitoring and Analytics

### 1. Atlas Dashboard Features

#### Performance Monitoring
- **Query Performance**: Monitor slow queries
- **Connection Count**: Track active connections
- **Storage Usage**: Monitor database size
- **Index Usage**: Optimize indexes

#### Real-time Metrics
- **Operations per Second**: Track database load
- **Memory Usage**: Monitor RAM consumption
- **Network I/O**: Track data transfer

### 2. Set Up Alerts

#### Alert Configuration
1. Go to **Alerts** in Atlas dashboard
2. Create alerts for:
   - **High CPU Usage**: >80%
   - **High Memory Usage**: >85%
   - **Connection Count**: >100
   - **Storage Usage**: >90%

## 🔄 Database Migration

### 1. Local to Atlas Migration

#### Export Local Data
```bash
# Export all collections
mongodump --db roomnmeal --out ./backup

# Export specific collections
mongoexport --db roomnmeal --collection users --out users.json
mongoexport --db roomnmeal --collection rooms --out rooms.json
```

#### Import to Atlas
```bash
# Import all data
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net/roomnmeal" ./backup/roomnmeal

# Import specific collections
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/roomnmeal" --collection users --file users.json
```

### 2. Automated Migration Script

```javascript
// scripts/migrate-to-atlas.js
const mongoose = require('mongoose');
const { setupDatabase } = require('../utils/databaseSetup');

const migrateToAtlas = async () => {
  try {
    console.log('Starting migration to MongoDB Atlas...');
    
    // Connect to Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    
    // Setup database indexes
    await setupDatabase();
    console.log('Database setup completed');
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
};

migrateToAtlas();
```

## 🚀 Production Deployment

### 1. Atlas Production Setup

#### Cluster Configuration
```
Cluster Tier: M10 or higher
Storage: 10GB minimum
Backup: Enabled
Monitoring: Enabled
Alerts: Configured
```

#### Security Settings
```javascript
// Production security checklist
✅ SSL/TLS enabled
✅ Network access restricted
✅ Database user with minimal privileges
✅ Regular backups enabled
✅ Monitoring and alerts configured
```

### 2. Environment Variables

#### Production Environment
```env
# MongoDB Atlas Production
MONGODB_URI=mongodb+srv://roomnmeal_prod:secure_password@roomnmeal-prod-cluster.xxxxx.mongodb.net/roomnmeal?retryWrites=true&w=majority

# Security
NODE_ENV=production
JWT_SECRET=your-very-secure-production-jwt-secret

# Performance
MONGODB_POOL_SIZE=10
MONGODB_SERVER_SELECTION_TIMEOUT=5000
```

### 3. Performance Optimization

#### Connection Pooling
```javascript
// Optimize for production
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0
});
```

#### Index Optimization
```javascript
// Atlas automatically optimizes indexes
// Monitor index usage in Atlas dashboard
// Remove unused indexes for better performance
```

## 📈 Scaling Considerations

### 1. Atlas Scaling Options

#### Vertical Scaling
- **M10 → M20 → M30**: Increase RAM and CPU
- **Storage**: Increase storage as needed
- **Auto-scaling**: Enable automatic scaling

#### Horizontal Scaling
- **Sharding**: For very large datasets
- **Read Replicas**: For read-heavy workloads
- **Global Clusters**: For multi-region deployment

### 2. Cost Optimization

#### Free Tier (Development)
```
Storage: 512MB
RAM: Shared
Cost: Free
Limitations: 500 connections, 1000 operations/second
```

#### Production Tiers
```
M10: $0.08/hour (~$60/month)
M20: $0.23/hour (~$170/month)
M30: $0.57/hour (~$420/month)
```

## 🔍 Troubleshooting

### 1. Common Issues

#### Connection Issues
```bash
# Check connection string
echo $MONGODB_URI

# Test connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/roomnmeal"

# Check network access
# Verify IP is whitelisted in Atlas
```

#### Performance Issues
```javascript
// Monitor slow queries
db.getProfilingStatus()
db.setProfilingLevel(1, { slowms: 100 })

// Check index usage
db.collection.getIndexes()
```

### 2. Atlas Support

#### Documentation
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Guide](https://docs.mongodb.com/manual/reference/connection-string/)
- [Security Best Practices](https://docs.atlas.mongodb.com/security/)

#### Support Channels
- **Atlas Support**: Available in Atlas dashboard
- **Community Forum**: [MongoDB Community](https://community.mongodb.com/)
- **Documentation**: Comprehensive guides and tutorials

## 🎯 Quick Start Checklist

### Setup Checklist
- [ ] Create Atlas account
- [ ] Create cluster (M0 for development)
- [ ] Create database user
- [ ] Configure network access
- [ ] Get connection string
- [ ] Update environment variables
- [ ] Test connection
- [ ] Run database setup
- [ ] Verify indexes created
- [ ] Test application functionality

### Production Checklist
- [ ] Upgrade to M10+ cluster
- [ ] Configure production user privileges
- [ ] Restrict network access
- [ ] Set up monitoring and alerts
- [ ] Configure backups
- [ ] Test performance
- [ ] Deploy application
- [ ] Monitor metrics

---

**Your RoomNMeal project is now ready to use MongoDB Atlas!** 🎉

The database will automatically set up all necessary indexes and optimizations when you first connect to Atlas. 