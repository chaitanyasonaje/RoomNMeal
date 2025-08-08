# Environment Variables Setup Guide

## Issue Identified
The registration endpoint is failing because the `JWT_SECRET` environment variable is not configured in your Render deployment.

## Required Environment Variables

### 1. JWT_SECRET (CRITICAL - Missing)
- **Purpose**: Used to sign and verify JWT tokens for user authentication
- **Value**: A secure random string (at least 32 characters)
- **Example**: `roomnmeal-super-secret-jwt-key-2024-production`

### 2. MONGODB_URI (Should be configured)
- **Purpose**: MongoDB Atlas connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/database`

### 3. Other Optional Variables
- `CLIENT_URL`: Your frontend URL (https://roomnmeal.netlify.app)
- `RAZORPAY_KEY_ID`: For payment processing
- `RAZORPAY_KEY_SECRET`: For payment processing
- `CLOUDINARY_CLOUD_NAME`: For image uploads
- `CLOUDINARY_API_KEY`: For image uploads
- `CLOUDINARY_API_SECRET`: For image uploads

## How to Configure in Render

1. **Go to your Render Dashboard**
   - Visit: https://dashboard.render.com
   - Find your `roomnmeal-backend` service

2. **Navigate to Environment Variables**
   - Click on your service
   - Go to "Environment" tab
   - Click "Add Environment Variable"

3. **Add JWT_SECRET**
   - **Key**: `JWT_SECRET`
   - **Value**: `roomnmeal-super-secret-jwt-key-2024-production`
   - Click "Save Changes"

4. **Verify MONGODB_URI**
   - Check if `MONGODB_URI` is properly set
   - If not, add it with your MongoDB Atlas connection string

5. **Redeploy**
   - After adding environment variables, click "Manual Deploy"
   - Or wait for automatic redeploy

## Testing After Configuration

Once you've configured the environment variables, test the registration endpoint:

```bash
curl -X POST https://roomnmeal.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123",
    "phone": "+1234567890",
    "role": "student"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

## Current Status
- ✅ Backend deployed and running
- ✅ CORS configured correctly
- ✅ Frontend URLs updated
- ❌ JWT_SECRET missing (causing 500 errors)
- ❌ Registration endpoint failing

## Next Steps
1. Configure JWT_SECRET in Render dashboard
2. Verify MONGODB_URI is set
3. Test registration endpoint
4. Verify frontend registration works 