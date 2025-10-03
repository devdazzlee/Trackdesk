# Vercel Deployment Guide for Trackdesk CDN

## Option 1: Deploy CDN Script to Vercel (Recommended)

### Step 1: Create Vercel Project
```bash
# Create new directory
mkdir trackdesk-cdn
cd trackdesk-cdn

# Initialize npm project
npm init -y

# Install Vercel CLI
npm install -g vercel
```

### Step 2: Create Project Structure
```
trackdesk-cdn/
├── public/
│   └── trackdesk.js
├── vercel.json
└── package.json
```

### Step 3: Create vercel.json
```json
{
  "version": 2,
  "public": true,
  "headers": [
    {
      "source": "/trackdesk.js",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        },
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ],
  "functions": {
    "public/trackdesk.js": {
      "maxDuration": 10
    }
  }
}
```

### Step 4: Update trackdesk.js
```javascript
// Update the API URL in trackdesk.js
const TRACKDESK_CONFIG = {
  apiUrl: 'https://your-backend-api.vercel.app/api', // ← Your backend API URL
  version: '1.0.1',
  debug: false, // Set to false in production
  batchSize: 10,
  flushInterval: 5000
};
```

### Step 5: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Your CDN will be available at:
# https://trackdesk-cdn.vercel.app/trackdesk.js
```

### Step 6: Use in Websites
```html
<!-- Add this to any website -->
<script src="https://trackdesk-cdn.vercel.app/trackdesk.js" 
        data-website-id="web_your_id_here" 
        data-auto-init="true">
</script>
```

## Option 2: Deploy Full Stack to Vercel

### Step 1: Prepare Backend for Vercel
```bash
# In your backend directory
npm install vercel
```

### Step 2: Create vercel.json for Backend
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

### Step 3: Create vercel.json for Frontend
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

### Step 4: Deploy Backend
```bash
cd backend
vercel --prod
# Note the URL: https://trackdesk-backend.vercel.app
```

### Step 5: Deploy Frontend
```bash
cd frontend
vercel --prod
# Note the URL: https://trackdesk-frontend.vercel.app
```

### Step 6: Deploy CDN Script
```bash
cd trackdesk-cdn
vercel --prod
# Note the URL: https://trackdesk-cdn.vercel.app
```

### Step 7: Update Configuration
```javascript
// In trackdesk.js
const TRACKDESK_CONFIG = {
  apiUrl: 'https://trackdesk-backend.vercel.app/api', // ← Your backend URL
  version: '1.0.1',
  debug: false,
  batchSize: 10,
  flushInterval: 5000
};
```

## Option 3: Single File Deployment

### Step 1: Create Single HTML File
```html
<!DOCTYPE html>
<html>
<head>
    <title>Trackdesk CDN</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>Trackdesk CDN</h1>
    <p>CDN script is available at: <code>/trackdesk.js</code></p>
    
    <script>
        // Inline trackdesk.js content here
        (function() {
            'use strict';
            
            const TRACKDESK_CONFIG = {
                apiUrl: 'https://your-api.vercel.app/api',
                version: '1.0.1',
                debug: false,
                batchSize: 10,
                flushInterval: 5000
            };
            
            // ... rest of the script
        })();
    </script>
</body>
</html>
```

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

## Environment Variables Setup

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add the following:

```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_CDN_URL=https://your-cdn.vercel.app
```

## Custom Domain Setup

### Step 1: Add Domain in Vercel
1. Go to project settings
2. Navigate to Domains
3. Add your custom domain (e.g., cdn.yourdomain.com)

### Step 2: Update DNS
```
Type: CNAME
Name: cdn
Value: cname.vercel-dns.com
```

### Step 3: Update Script Configuration
```javascript
// In trackdesk.js
const TRACKDESK_CONFIG = {
  apiUrl: 'https://api.yourdomain.com/api', // ← Your custom API domain
  version: '1.0.1',
  debug: false,
  batchSize: 10,
  flushInterval: 5000
};
```

### Step 4: Use Custom Domain
```html
<script src="https://cdn.yourdomain.com/trackdesk.js" 
        data-website-id="web_your_id" 
        data-auto-init="true">
</script>
```

## Testing Your Deployment

### Step 1: Test CDN Script
```bash
# Test if script loads
curl https://your-cdn.vercel.app/trackdesk.js

# Should return the JavaScript code
```

### Step 2: Test API Endpoints
```bash
# Test health endpoint
curl https://your-api.vercel.app/health

# Test tracking endpoint
curl -X POST https://your-api.vercel.app/api/tracking/events \
  -H "Content-Type: application/json" \
  -d '{"events":[],"websiteId":"test","sessionId":"test"}'
```

### Step 3: Test Full Integration
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
    <script src="https://your-cdn.vercel.app/trackdesk.js" 
            data-website-id="web_test123" 
            data-auto-init="true">
    </script>
</head>
<body>
    <h1>Test Page</h1>
    <button onclick="testTracking()">Test Tracking</button>
    
    <script>
        function testTracking() {
            Trackdesk.track('test_event', {
                message: 'Hello from Vercel!'
            });
            alert('Event tracked!');
        }
    </script>
</body>
</html>
```

## Monitoring and Logs

### Vercel Logs
```bash
# View logs
vercel logs

# View logs for specific deployment
vercel logs --follow
```

### Performance Monitoring
- Vercel Analytics (built-in)
- Real User Monitoring (RUM)
- Error tracking
- Performance metrics

## Cost Optimization

### Vercel Pricing
- **Hobby**: Free tier available
- **Pro**: $20/month per team member
- **Enterprise**: Custom pricing

### Optimization Tips
1. Use edge functions for CDN script
2. Implement caching strategies
3. Monitor bandwidth usage
4. Use Vercel Analytics for insights

## Security Considerations

### CORS Configuration
```javascript
// In your backend
app.use(cors({
  origin: [
    'https://your-cdn.vercel.app',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));
```

### Rate Limiting
```javascript
// In your backend
const rateLimit = require('express-rate-limit');

const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});

app.use('/api/tracking', trackingLimiter);
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in backend
   - Verify domain origins

2. **Script Not Loading**
   - Check Vercel deployment status
   - Verify file path and permissions

3. **Events Not Tracking**
   - Check API endpoint URL
   - Verify website ID
   - Enable debug mode

4. **Performance Issues**
   - Monitor Vercel function execution time
   - Check database connection pooling
   - Optimize event batching

### Debug Mode
```javascript
// Enable debug mode
window.Trackdesk.config.debug = true;

// Check if script loaded
console.log('Trackdesk loaded:', !!window.Trackdesk);

// Check event queue
console.log('Event queue:', Trackdesk.getEventQueue());
```

This guide should help you deploy your Trackdesk CDN system to Vercel successfully!
