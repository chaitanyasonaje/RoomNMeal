# 🏡 RoomNMeal - Student Accommodation & Services Platform

A comprehensive MERN stack web application for students to book rooms, subscribe to mess services, and access additional amenities in college towns.

## 🚀 Features

### Core Features
- **Multi-role Authentication**: Student, Host, Mess Provider, Admin roles
- **Room Booking System**: Search, filter, and book verified accommodations
- **Mess Subscription**: Subscribe to quality meal plans from verified providers
- **Real-time Chat**: Direct messaging between users with typing indicators
- **Secure Payments**: Integrated Razorpay payment gateway
- **Admin Dashboard**: Comprehensive management panel for platform oversight

### Advanced Features
- **Wallet System**: Digital wallet for transactions and refunds
- **Service Management**: Laundry and tea services
- **User Verification**: Admin-controlled verification system
- **Profile Management**: Complete user profile with preferences
- **Booking Management**: Track and manage all bookings
- **Real-time Notifications**: Socket.IO powered notifications

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **React DatePicker** - Date selection
- **React Image Gallery** - Image carousels

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage
- **Razorpay** - Payment gateway
- **Nodemailer** - Email notifications

### Development Tools
- **Concurrently** - Run multiple commands
- **Nodemon** - Auto-restart server
- **ESLint** - Code linting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RoomNMeal
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/roomnmeal

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
```

### 4. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# The application will automatically create collections on first run
```

### 5. Run the Application
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
npm run server  # Backend only
npm run client  # Frontend only
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Project Structure

```
RoomNMeal/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts
│   │   ├── pages/         # Page components
│   │   └── index.js       # App entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── middlewares/       # Express middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── server.js         # Server entry point
├── package.json           # Root package.json
└── README.md
```

## 🔐 Authentication & Roles

### User Roles
1. **Student**: Can book rooms, subscribe to mess, use services
2. **Host**: Can list and manage rooms
3. **Mess Provider**: Can create and manage mess plans
4. **Admin**: Full platform management access

### Features by Role
- **Students**: Room booking, mess subscription, chat, wallet
- **Hosts**: Room management, booking requests, chat with students
- **Mess Providers**: Plan management, subscription handling
- **Admins**: User management, verification, analytics, system oversight

## 💰 Payment Integration

### Supported Payment Methods
- **Razorpay**: Online payments
- **Wallet**: Internal wallet system
- **Cash**: Offline payments

### Transaction Types
- Room booking payments
- Mess subscription fees
- Wallet recharges
- Service payments (laundry, tea)
- Refunds

## 🗨️ Real-time Features

### Socket.IO Implementation
- Real-time chat messaging
- Typing indicators
- Online/offline status
- Service status updates
- Booking notifications

## 📊 Admin Dashboard

### Management Features
- **User Management**: View, verify, activate/deactivate users
- **Room Management**: Monitor and manage room listings
- **Booking Analytics**: Track all bookings and revenue
- **Mess Plan Management**: Oversee mess service providers
- **System Statistics**: Platform-wide analytics and metrics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create room (host only)
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room (host only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id` - Update booking status

### Mess Services
- `GET /api/mess/plans` - Get mess plans
- `POST /api/mess/subscribe` - Subscribe to mess plan
- `GET /api/mess/subscriptions` - Get user subscriptions

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/messages/:userId` - Get messages with user
- `POST /api/chat/send` - Send message

### Admin (Admin only)
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/verify` - Verify user
- `PUT /api/admin/users/:id/status` - Update user status

### Reviews
- `GET /api/reviews/:targetModel/:targetId` - Get reviews for a target
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review
- `POST /api/reviews/:id/helpful` - Mark review as helpful
- `POST /api/reviews/:id/reply` - Reply to a review

### Services
- `GET /api/services` - Get all services with filters
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create new service (providers only)
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `POST /api/services/:id/book` - Book a service
- `GET /api/services/orders/my-orders` - Get user's service orders
- `GET /api/services/orders/provider-orders` - Get provider's service orders

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `PUT /api/notifications/:id/archive` - Archive notification
- `DELETE /api/notifications/:id` - Delete notification

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
# Deploy the build folder to your hosting service
```

### Backend Deployment
```bash
cd server
npm start
# Deploy to your server or cloud platform
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Configure production payment keys
- Set up production email service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Project Status

✅ **Completed Features:**
- Complete user authentication system
- Multi-role user management
- Room booking system with search and filters
- Mess subscription system
- Real-time chat functionality
- Admin dashboard with comprehensive management
- Payment integration with Razorpay
- Profile management system
- Booking management
- Wallet system
- File upload with Cloudinary
- Responsive design with Tailwind CSS
- **NEW: Comprehensive Review & Rating System**
- **NEW: Enhanced Services Module (Laundry, Cleaning, Food, Transport)**
- **NEW: Advanced Notification System**
- **NEW: Service Order Management**
- **NEW: Enhanced Search & Filtering**

🔄 **Ready for Production:**
- All core features implemented
- Comprehensive error handling
- Security measures in place
- Real-time functionality working
- Admin panel fully functional

The RoomNMeal platform is now complete and ready for deployment! 🎉 