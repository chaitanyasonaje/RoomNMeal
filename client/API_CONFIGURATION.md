# API Configuration Guide

## Overview
This document explains how the API endpoints are configured in the RoomNMeal React frontend and how to manage backend URL changes.

## Current Configuration

### Backend URL
The frontend is currently configured to use the deployed backend at:
```
https://roomnmeal-backend.onrender.com
```

### Configuration Files

#### 1. Centralized API Config (`src/config/api.js`)
- **Purpose**: Central location for all API configuration
- **Usage**: Import and use the `API_BASE_URL` and `API_ENDPOINTS` constants
- **Benefits**: Easy to change backend URL in one place

#### 2. Direct URL Usage
All API calls in the application have been updated to use the full backend URL directly.

## Files Updated

The following files have been updated to use the full backend URL:

### Context Files
- `src/context/AuthContext.js` - Authentication API calls

### Page Files
- `src/pages/Rooms.js` - Room listing
- `src/pages/RoomDetail.js` - Room details
- `src/pages/MessPlans.js` - Mess plans listing
- `src/pages/MessDetail.js` - Mess plan details
- `src/pages/Dashboard.js` - Dashboard data
- `src/pages/Chat.js` - Chat functionality
- `src/pages/Bookings.js` - Booking management
- `src/pages/AdminDashboard.js` - Admin functionality

### Component Files
- `src/components/BookingForm.js` - Booking creation
- `src/components/BookingCard.js` - Booking status updates

## How to Change Backend URL

### Option 1: Update Central Config (Recommended)
1. Edit `src/config/api.js`
2. Change the `API_BASE_URL` constant
3. Update all files to use the centralized config

### Option 2: Search and Replace
1. Use search and replace in your editor
2. Replace `https://roomnmeal-backend.onrender.com` with your new URL
3. Update all files that contain API calls

## Environment Variables (Future Enhancement)

To use environment variables instead of hardcoded URLs:

1. Create a `.env` file in the client directory:
```
REACT_APP_API_BASE_URL=https://roomnmeal-backend.onrender.com
```

2. Update `src/config/api.js`:
```javascript
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://roomnmeal-backend.onrender.com';
```

3. Add `.env` to your `.gitignore` file

## Testing

After making changes:
1. Test all major functionality (login, room browsing, booking, etc.)
2. Check browser network tab for successful API calls
3. Verify no 404 errors in console

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend allows requests from your frontend domain
2. **404 Errors**: Verify the backend URL is correct and accessible
3. **Authentication Issues**: Check if tokens are being sent correctly

### Debug Steps
1. Open browser developer tools
2. Check Network tab for failed requests
3. Verify API endpoints are correct
4. Test backend URL directly in browser

## Deployment Notes

- For Netlify deployment, ensure the backend URL is accessible
- Consider using environment variables for different deployment environments
- Test thoroughly after deployment to ensure all API calls work 