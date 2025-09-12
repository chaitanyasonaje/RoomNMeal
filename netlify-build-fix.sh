#!/bin/bash

# Netlify Build Fix Script
# This script ensures proper MIME types and build output

echo "🚀 Starting Netlify build fix..."

# Navigate to client directory
cd client

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️ Building project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed - no build directory found"
    exit 1
fi

echo "✅ Build completed successfully"

# Create _headers file in build directory
echo "📝 Creating _headers file..."
cat > build/_headers << EOF
# MIME type headers for static assets
/static/css/*
  Content-Type: text/css

/static/js/*
  Content-Type: application/javascript

/*.css
  Content-Type: text/css

/*.js
  Content-Type: application/javascript

/*.json
  Content-Type: application/json

/*.png
  Content-Type: image/png

/*.jpg
  Content-Type: image/jpeg

/*.jpeg
  Content-Type: image/jpeg

/*.gif
  Content-Type: image/gif

/*.svg
  Content-Type: image/svg+xml

/*.ico
  Content-Type: image/x-icon

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
EOF

# Create _redirects file in build directory
echo "📝 Creating _redirects file..."
cat > build/_redirects << EOF
# API redirects
/api/* https://roomnmeal.onrender.com/api/:splat 200

# SPA fallback
/* /index.html 200
EOF

echo "✅ Netlify build fix completed!"
echo "📁 Build directory contents:"
ls -la build/

echo "🎉 Ready for deployment!"
