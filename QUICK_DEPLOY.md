# 🚀 Quick Deploy: Vercel + Render

## 📋 Prerequisites
- GitHub repository: `https://github.com/chaitanyasonaje/RoomNMeal.git`
- MongoDB Atlas connection string (already configured)
- Render account (free tier available)
- Vercel account (free tier available)

---

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### 1.2 Connect GitHub Repository
1. **Repository**: `chaitanyasonaje/RoomNMeal`
2. **Name**: `roomnmeal-backend`
3. **Environment**: `Node`
4. **Region**: Choose closest to you
5. **Branch**: `master`

### 1.3 Configure Build Settings
```
Build Command: cd server && npm install
Start Command: cd server && npm start
```

### 1.4 Set Environment Variables
Click "Environment" tab and add:

```
MONGODB_URI=mongodb+srv://chaitanyasonaje0205:Chaitanya@0205@cluster0.5fwe9d6.mongodb.net/roomnmeal?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=roomnmeal-super-secret-jwt-key-2024
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 1.5 Deploy
Click "Create Web Service" and wait for deployment.

---

## 🎯 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"

### 2.2 Import Repository
1. **Repository**: `chaitanyasonaje/RoomNMeal`
2. **Framework Preset**: `Create React App`
3. **Root Directory**: `client`
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`

### 2.3 Configure Environment Variables
Add these environment variables:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
```

### 2.4 Deploy
Click "Deploy" and wait for deployment.

---

## 🔧 Alternative: CLI Deployment

### Backend (Render CLI)
```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Deploy backend
cd server
render deploy
```

### Frontend (Vercel CLI)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd client
vercel
```

---

## 📊 Post-Deployment Checklist

### Backend (Render)
- [ ] Service is running (green status)
- [ ] Environment variables set
- [ ] Database connection working
- [ ] API endpoints responding
- [ ] CORS configured for frontend domain

### Frontend (Vercel)
- [ ] Build successful
- [ ] Environment variables set
- [ ] API calls working
- [ ] Real-time features functional
- [ ] Mobile responsive

### Database (MongoDB Atlas)
- [ ] IP whitelist updated with Render IPs
- [ ] Connection string working
- [ ] Sample data created
- [ ] Indexes optimized

---

## 🔗 URLs to Update

After deployment, update these URLs:

### Backend URL
- Render will provide: `https://roomnmeal-backend.onrender.com`

### Frontend URL
- Vercel will provide: `https://roomnmeal.vercel.app`

### Update Environment Variables
1. **Render**: Update `CLIENT_URL` with your Vercel URL
2. **Vercel**: Update `REACT_APP_API_URL` with your Render URL

---

## 🆘 Troubleshooting

### Common Issues:
1. **Build Failures**: Check Node.js version compatibility
2. **CORS Errors**: Update CORS_ORIGIN in backend
3. **Database Connection**: Verify MongoDB Atlas IP whitelist
4. **Environment Variables**: Ensure all required vars are set

### Debug Commands:
```bash
# Check Render logs
render logs

# Check Vercel logs
vercel logs

# Test database connection
npm run migrate-atlas
```

---

## 🎉 Success Indicators

- ✅ Backend API responding at Render URL
- ✅ Frontend loading at Vercel URL
- ✅ User registration/login working
- ✅ Room booking functionality working
- ✅ Real-time chat working
- ✅ Payment integration ready
- ✅ Admin dashboard accessible

---

**🚀 Your RoomNMeal app will be live at:**
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **Database**: MongoDB Atlas (cloud-hosted)

**Ready to deploy? Follow the steps above!** 🎯 