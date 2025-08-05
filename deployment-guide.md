# 🚀 RoomNMeal Deployment Guide

## 📋 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended
### Option 2: Netlify (Frontend) + Render (Backend)
### Option 3: Heroku (Full Stack)
### Option 4: DigitalOcean App Platform

---

## 🎯 Option 1: Vercel + Railway (Recommended)

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd client
   vercel
   ```

3. **Configure Environment Variables in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-backend-url.railway.app`

### Backend Deployment (Railway)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Deploy Backend**:
   ```bash
   cd server
   railway init
   railway up
   ```

4. **Configure Environment Variables in Railway**:
   ```bash
   railway variables set MONGODB_URI=your-atlas-connection-string
   railway variables set JWT_SECRET=your-jwt-secret
   railway variables set CLIENT_URL=https://your-frontend-url.vercel.app
   ```

---

## 🎯 Option 2: Netlify + Render

### Frontend Deployment (Netlify)

1. **Build the Frontend**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `build` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=build`

### Backend Deployment (Render)

1. **Create a Render Account**
2. **Create New Web Service**
3. **Connect your GitHub repository**
4. **Configure Build Settings**:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

---

## 🎯 Option 3: Heroku (Full Stack)

### Prerequisites
```bash
npm install -g heroku
heroku login
```

### Deploy to Heroku

1. **Create Heroku App**:
   ```bash
   heroku create roomnmeal-app
   ```

2. **Add Buildpacks**:
   ```bash
   heroku buildpacks:add --index 1 heroku/nodejs
   heroku buildpacks:add --index 2 https://github.com/heroku/heroku-buildpack-static
   ```

3. **Configure Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI=your-atlas-connection-string
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**:
   ```bash
   git push heroku master
   ```

---

## 🎯 Option 4: DigitalOcean App Platform

### Frontend Deployment

1. **Create App in DigitalOcean**
2. **Connect GitHub Repository**
3. **Configure Build Settings**:
   - Source Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`

### Backend Deployment

1. **Create Another App for Backend**
2. **Configure Build Settings**:
   - Source Directory: `server`
   - Build Command: `npm install`
   - Run Command: `npm start`

---

## 🔧 Environment Variables Setup

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_SOCKET_URL=https://your-backend-url.com
```

### Backend Environment Variables
```env
MONGODB_URI=your-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
PORT=5000
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

---

## 📦 Build Scripts

### Update package.json for Deployment

```json
{
  "scripts": {
    "build": "cd client && npm run build",
    "start": "cd server && npm start",
    "heroku-postbuild": "cd client && npm install && npm run build"
  }
}
```

---

## 🔒 Security Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas whitelist updated with deployment IPs
- [ ] CORS configured for production domains
- [ ] SSL certificates enabled
- [ ] API keys secured
- [ ] Database backups enabled

---

## 🚀 Quick Deploy Commands

### Vercel + Railway (Recommended)
```bash
# Frontend
cd client && vercel

# Backend
cd server && railway up
```

### Heroku
```bash
heroku create roomnmeal-app
heroku config:set MONGODB_URI=your-atlas-uri
git push heroku master
```

---

## 📊 Monitoring & Maintenance

1. **Set up monitoring** (Uptime Robot, Pingdom)
2. **Configure error tracking** (Sentry, LogRocket)
3. **Set up automated backups**
4. **Monitor performance metrics**
5. **Set up alerts for downtime**

---

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Update CORS_ORIGIN in backend
2. **Database connection**: Check MongoDB Atlas IP whitelist
3. **Build failures**: Check Node.js version compatibility
4. **Environment variables**: Verify all required vars are set

### Debug Commands:
```bash
# Check deployment logs
heroku logs --tail
railway logs
vercel logs

# Test database connection
npm run migrate-atlas
```

---

## 🎉 Success Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend API responding
- [ ] Database connected and working
- [ ] Authentication system functional
- [ ] Payment integration tested
- [ ] Real-time features working
- [ ] Admin dashboard accessible
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Security measures implemented

---

**🎯 Ready to deploy? Choose your preferred platform and follow the steps above!** 