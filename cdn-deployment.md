# Trackdesk CDN Deployment Guide

## Overview
This guide explains how to deploy the Trackdesk CDN tracking system to collect website analytics data and display it in your dashboard.

## Architecture

```
Website (Client) → CDN Script → Trackdesk API → Database → Dashboard
```

## Components

### 1. CDN Script (`trackdesk.js`)
- Lightweight JavaScript tracking script
- Captures page views, clicks, conversions, and custom events
- Batches events for efficient transmission
- Respects user privacy settings

### 2. Backend API
- Receives and processes tracking events
- Stores data in PostgreSQL database
- Provides analytics endpoints
- Real-time data processing

### 3. Dashboard
- Visualizes tracking data
- Real-time analytics
- Export capabilities
- Website management

## Deployment Options

### Option 1: Self-Hosted CDN

#### 1. Deploy Backend
```bash
# Clone repository
git clone https://github.com/your-org/trackdesk.git
cd trackdesk/backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Set up database
npm run db:push
npm run db:generate

# Start server
npm run dev  # Development
npm start    # Production
```

#### 2. Deploy Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start server
npm start
```

#### 3. Serve CDN Script
```bash
# Copy script to public directory
cp trackdesk.js /var/www/html/

# Configure web server (nginx example)
server {
    listen 80;
    server_name cdn.yourdomain.com;
    
    location / {
        root /var/www/html;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
    }
}
```

### Option 2: Cloud CDN (Recommended)

#### AWS CloudFront
```bash
# 1. Upload script to S3
aws s3 cp trackdesk.js s3://your-bucket/trackdesk.js

# 2. Create CloudFront distribution
# - Origin: S3 bucket
# - CORS: Enable
# - Cache: Disable for script file
# - Headers: Add CORS headers
```

#### Cloudflare
```bash
# 1. Upload script to Cloudflare Workers
# 2. Configure CORS headers
# 3. Set up custom domain
```

#### Vercel
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Configure custom domain
# 3. Set up CORS headers
```

## Configuration

### 1. Environment Variables
```env
# Backend
DATABASE_URL="postgresql://user:password@localhost:5432/trackdesk_db"
JWT_SECRET="your-secret-key"
API_URL="https://api.yourdomain.com"

# Frontend
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
NEXT_PUBLIC_CDN_URL="https://cdn.yourdomain.com"
```

### 2. CDN Script Configuration
```javascript
// In trackdesk.js, update the API URL
const TRACKDESK_CONFIG = {
  apiUrl: 'https://api.yourdomain.com', // Your API URL
  version: '1.0.0',
  debug: false,
  batchSize: 10,
  flushInterval: 5000
};
```

### 3. Database Schema
Add these tables to your Prisma schema:

```prisma
model TrackingWebsite {
  id          String   @id @default(cuid())
  accountId   String
  name        String
  domain      String
  description String?
  settings    Json     @default("{}")
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("tracking_websites")
}

model TrackingSession {
  id          String   @id @default(cuid())
  websiteId   String
  userId      String?
  startTime   DateTime @default(now())
  lastActivity DateTime @default(now())
  userAgent   String
  ipAddress   String
  country     String   @default("Unknown")
  city        String   @default("Unknown")
  device      Json     @default("{}")
  referrer    String?
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmTerm     String?
  utmContent  String?

  @@map("tracking_sessions")
}

model TrackingEvent {
  id        String   @id @default(cuid())
  sessionId String
  websiteId String
  userId    String?
  eventType String
  data      Json     @default("{}")
  timestamp DateTime @default(now())
  page      Json     @default("{}")
  device    Json     @default("{}")
  browser   Json     @default("{}")
  location  Json?

  @@map("tracking_events")
}

model TrackingStats {
  id                   String   @id @default(cuid())
  websiteId            String
  date                 String
  pageViews            Int      @default(0)
  uniqueVisitors       Int      @default(0)
  clicks               Int      @default(0)
  conversions          Int      @default(0)
  bounceRate           Float    @default(0)
  avgSessionDuration   Float    @default(0)
  otherEvents          Int      @default(0)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@unique([websiteId, date])
  @@map("tracking_stats")
}
```

## Usage

### 1. Add Website to Dashboard
1. Go to Admin → Tracking
2. Click "Add Website"
3. Enter website details
4. Copy the tracking code

### 2. Install Tracking Code
```html
<!-- Add this to your website's <head> section -->
<script src="https://cdn.yourdomain.com/trackdesk.js" 
        data-website-id="your-website-id" 
        data-auto-init="true">
</script>
```

### 3. Custom Configuration
```html
<!-- Custom configuration -->
<script>
  window.Trackdesk = window.Trackdesk || {};
  window.Trackdesk.config = {
    apiUrl: 'https://api.yourdomain.com',
    debug: true,
    batchSize: 5
  };
</script>
<script src="https://cdn.yourdomain.com/trackdesk.js" 
        data-website-id="your-website-id" 
        data-auto-init="true">
</script>
```

### 4. Track Custom Events
```javascript
// Track custom events
Trackdesk.track('purchase', {
  product: 'Premium Plan',
  value: 99.99,
  currency: 'USD'
});

// Identify users
Trackdesk.identify('user-123', {
  email: 'user@example.com',
  name: 'John Doe'
});

// Track conversions
Trackdesk.convert({
  type: 'signup',
  value: 0,
  data: {
    plan: 'free'
  }
});
```

## Monitoring

### 1. Health Checks
```bash
# Check API health
curl https://api.yourdomain.com/health

# Check CDN script
curl https://cdn.yourdomain.com/trackdesk.js
```

### 2. Logs
```bash
# Backend logs
tail -f logs/combined.log
tail -f logs/error.log

# CDN logs (if using nginx)
tail -f /var/log/nginx/access.log
```

### 3. Database Monitoring
```sql
-- Check event processing
SELECT COUNT(*) FROM tracking_events WHERE timestamp > NOW() - INTERVAL '1 hour';

-- Check website stats
SELECT * FROM tracking_stats ORDER BY date DESC LIMIT 10;
```

## Security

### 1. CORS Configuration
```javascript
// Backend CORS settings
app.use(cors({
  origin: ['https://yourdomain.com', 'https://cdn.yourdomain.com'],
  credentials: true
}));
```

### 2. Rate Limiting
```javascript
// Rate limiting for tracking endpoints
const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});

app.use('/api/tracking', trackingLimiter);
```

### 3. Data Privacy
```javascript
// Respect Do Not Track
if (navigator.doNotTrack === '1') {
  // Disable tracking
  return;
}

// Anonymize IP addresses
const anonymizedIP = ipAddress.replace(/\.\d+$/, '.0');
```

## Performance Optimization

### 1. CDN Caching
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Don't cache tracking script
location /trackdesk.js {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 2. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_tracking_events_website_timestamp ON tracking_events(website_id, timestamp);
CREATE INDEX idx_tracking_events_session ON tracking_events(session_id);
CREATE INDEX idx_tracking_sessions_website ON tracking_sessions(website_id);
```

### 3. Batch Processing
```javascript
// Process events in batches
const batchSize = 100;
const events = await getEventsBatch(batchSize);
await processEventsBatch(events);
```

## Troubleshooting

### Common Issues

1. **Script not loading**
   - Check CDN URL
   - Verify CORS headers
   - Check browser console for errors

2. **Events not being tracked**
   - Verify website ID
   - Check API endpoint
   - Review network requests

3. **Dashboard not showing data**
   - Check database connection
   - Verify event processing
   - Review API logs

### Debug Mode
```javascript
// Enable debug mode
window.Trackdesk.config.debug = true;

// Check if script is loaded
console.log('Trackdesk loaded:', !!window.Trackdesk);

// Check event queue
console.log('Event queue:', window.Trackdesk.eventQueue);
```

## Scaling

### 1. Horizontal Scaling
- Use load balancers
- Implement database sharding
- Use Redis for session storage

### 2. Vertical Scaling
- Increase server resources
- Optimize database queries
- Use connection pooling

### 3. CDN Scaling
- Use multiple CDN providers
- Implement failover
- Monitor CDN performance

## Cost Optimization

### 1. Data Retention
```sql
-- Delete old events (older than 1 year)
DELETE FROM tracking_events 
WHERE timestamp < NOW() - INTERVAL '1 year';
```

### 2. Compression
```javascript
// Compress event data
const compressedData = JSON.stringify(data);
```

### 3. Sampling
```javascript
// Sample events for high-traffic websites
if (Math.random() < 0.1) { // 10% sampling
  Trackdesk.track('page_view', data);
}
```

## Support

For support and questions:
- GitHub Issues: https://github.com/your-org/trackdesk/issues
- Documentation: https://docs.trackdesk.com
- Email: support@trackdesk.com
