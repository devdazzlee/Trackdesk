# Trackdesk CDN Tracking Flow Explanation

## 1. How the Script Works - Complete Flow

### Step-by-Step Process:

```
1. User visits website with tracking script
   ↓
2. Script loads and initializes
   ↓
3. Generates unique session ID for this user
   ↓
4. Captures page view automatically
   ↓
5. Sets up event listeners (clicks, scrolls, forms)
   ↓
6. User interacts with website
   ↓
7. Events are queued locally
   ↓
8. Events sent to your API in batches
   ↓
9. Your backend processes and stores data
   ↓
10. Dashboard shows real-time analytics
```

### Detailed Flow:

#### A. Script Initialization
```javascript
// When script loads on any website:
1. Reads data-website-id from script tag
2. Generates unique sessionId for this user session
3. Sets up event listeners for clicks, scrolls, forms
4. Automatically tracks page view
5. Starts batching events locally
```

#### B. Event Collection
```javascript
// Every user interaction:
1. User clicks button → event queued
2. User scrolls page → event queued  
3. User submits form → event queued
4. User navigates → page view queued
5. Events stored in local queue (max 10 events)
```

#### C. Data Transmission
```javascript
// Every 5 seconds or when queue is full:
1. Batch of events sent to your API
2. POST /api/tracking/events
3. Your backend processes and stores data
4. Events cleared from local queue
```

## 2. Multiple Users on Same Website

### How It Works:
- **Each user gets unique session ID** (generated when they visit)
- **Same website ID** (identifies which website)
- **Different user data** (IP, device, browser, etc.)

### Example:
```javascript
// User 1 visits example.com
sessionId: "sess_abc123" + timestamp
websiteId: "web_xyz789" (from script tag)
userId: null (until they identify)

// User 2 visits same example.com  
sessionId: "sess_def456" + timestamp
websiteId: "web_xyz789" (same website)
userId: null (until they identify)
```

### Data Structure:
```json
{
  "events": [
    {
      "id": "evt_001",
      "event": "page_view",
      "sessionId": "sess_abc123", // Unique per user
      "websiteId": "web_xyz789",  // Same for all users of this site
      "userId": null,
      "timestamp": "2024-01-07T14:30:00Z",
      "page": {
        "url": "https://example.com/products",
        "title": "Products Page"
      },
      "device": {
        "userAgent": "Mozilla/5.0...",
        "screenWidth": 1920,
        "screenHeight": 1080
      }
    }
  ]
}
```

## 3. Deployment Options

### Option A: Vercel (Recommended for CDN Script)
```bash
# 1. Create new Vercel project
vercel init trackdesk-cdn
cd trackdesk-cdn

# 2. Create public/trackdesk.js
# 3. Update API URL in script
# 4. Deploy
vercel --prod
```

### Option B: Single File Hosting
```bash
# 1. Upload trackdesk.js to any web server
# 2. Update API URL in script
# 3. Serve with proper CORS headers
```

### Option C: Your Own Domain
```bash
# 1. Upload to your domain
# 2. Update script configuration
# 3. Set up CORS headers
```

## 4. Credentials to Change

### In trackdesk.js:
```javascript
const TRACKDESK_CONFIG = {
  apiUrl: 'https://your-api-domain.com', // ← CHANGE THIS
  version: '1.0.0',
  debug: false, // ← Set to true for testing
  batchSize: 10,
  flushInterval: 5000
};
```

### In your backend:
```env
# .env file
DATABASE_URL="postgresql://user:password@localhost:5432/trackdesk_db"
JWT_SECRET="your-secret-key"
API_URL="https://your-api-domain.com"
CDN_URL="https://your-cdn-domain.com"
```

## 5. How to Generate Unique Website IDs

### Method 1: Dashboard (Recommended)
```javascript
// 1. Go to your dashboard
// 2. Admin → Tracking → Add Website
// 3. Enter website details
// 4. Copy generated website ID
// 5. Use in script tag
```

### Method 2: API
```javascript
// POST /api/websites
{
  "name": "My Website",
  "domain": "example.com",
  "description": "My awesome website"
}

// Response:
{
  "id": "web_abc123def456", // ← Use this as website ID
  "name": "My Website",
  "domain": "example.com"
}
```

### Method 3: Manual Generation
```javascript
// Generate unique ID
const websiteId = 'web_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
```

## 6. Checkout Page Implementation

### Basic Purchase Tracking:
```html
<!-- On checkout success page -->
<script>
// Track successful purchase
Trackdesk.track('purchase', {
  orderId: 'ORD-12345',
  value: 99.99,
  currency: 'USD',
  items: [
    {
      id: 'PROD-001',
      name: 'Premium Plan',
      category: 'Software',
      price: 99.99,
      quantity: 1
    }
  ],
  customer: {
    email: 'customer@example.com',
    id: 'CUST-123'
  }
});

// Track conversion
Trackdesk.convert({
  type: 'purchase',
  value: 99.99,
  currency: 'USD',
  orderId: 'ORD-12345'
});
</script>
```

### Advanced E-commerce Tracking:
```html
<!-- On product page -->
<script>
// Track product view
Trackdesk.track('product_view', {
  productId: 'PROD-001',
  productName: 'Premium Plan',
  category: 'Software',
  price: 99.99,
  currency: 'USD'
});
</script>

<!-- On add to cart -->
<script>
// Track add to cart
Trackdesk.track('add_to_cart', {
  productId: 'PROD-001',
  productName: 'Premium Plan',
  price: 99.99,
  currency: 'USD',
  quantity: 1
});
</script>

<!-- On checkout start -->
<script>
// Track checkout start
Trackdesk.track('checkout_start', {
  value: 99.99,
  currency: 'USD',
  items: [
    {
      id: 'PROD-001',
      name: 'Premium Plan',
      price: 99.99,
      quantity: 1
    }
  ]
});
</script>

<!-- On purchase completion -->
<script>
// Track purchase completion
Trackdesk.track('purchase_complete', {
  orderId: 'ORD-12345',
  value: 99.99,
  currency: 'USD',
  paymentMethod: 'credit_card',
  items: [
    {
      id: 'PROD-001',
      name: 'Premium Plan',
      price: 99.99,
      quantity: 1
    }
  ],
  customer: {
    email: 'customer@example.com',
    id: 'CUST-123'
  },
  shipping: {
    method: 'standard',
    cost: 0
  },
  tax: 8.99
});
</script>
```

## 7. Common Errors and Fixes

### Error 1: "No website ID found"
```html
<!-- Wrong -->
<script src="trackdesk.js"></script>

<!-- Correct -->
<script src="trackdesk.js" data-website-id="web_abc123"></script>
```

### Error 2: "Failed to send events"
```javascript
// Check API URL
const TRACKDESK_CONFIG = {
  apiUrl: 'https://your-correct-api-url.com' // ← Make sure this is correct
};
```

### Error 3: CORS errors
```javascript
// Backend CORS configuration
app.use(cors({
  origin: ['https://your-website.com', 'https://your-cdn.com'],
  credentials: true
}));
```

### Error 4: Events not showing in dashboard
```javascript
// Check if events are being sent
window.Trackdesk.config.debug = true; // Enable debug mode
```

## 8. Complete Implementation Example

### Step 1: Deploy Backend
```bash
# Deploy your Trackdesk backend
# Make sure API is accessible at https://api.yourdomain.com
```

### Step 2: Deploy CDN Script
```bash
# Deploy trackdesk.js to https://cdn.yourdomain.com/trackdesk.js
# Update API URL in script
```

### Step 3: Add Website to Dashboard
```javascript
// Go to dashboard → Admin → Tracking → Add Website
// Get website ID: web_abc123def456
```

### Step 4: Install on Website
```html
<!-- Add to website's <head> -->
<script src="https://cdn.yourdomain.com/trackdesk.js" 
        data-website-id="web_abc123def456" 
        data-auto-init="true">
</script>
```

### Step 5: Track Checkout
```html
<!-- On checkout success page -->
<script>
Trackdesk.track('purchase', {
  orderId: 'ORD-12345',
  value: 99.99,
  currency: 'USD',
  items: [
    {
      id: 'PROD-001',
      name: 'Premium Plan',
      price: 99.99,
      quantity: 1
    }
  ]
});
</script>
```

## 9. Testing Your Implementation

### Test Script:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
    <script src="https://cdn.yourdomain.com/trackdesk.js" 
            data-website-id="web_test123" 
            data-auto-init="true">
    </script>
</head>
<body>
    <h1>Test Page</h1>
    <button onclick="testPurchase()">Test Purchase</button>
    
    <script>
        function testPurchase() {
            Trackdesk.track('purchase', {
                orderId: 'TEST-001',
                value: 29.99,
                currency: 'USD',
                items: [
                    {
                        id: 'TEST-PROD',
                        name: 'Test Product',
                        price: 29.99,
                        quantity: 1
                    }
                ]
            });
            alert('Purchase tracked!');
        }
    </script>
</body>
</html>
```

### Debug Mode:
```javascript
// Enable debug mode to see what's happening
window.Trackdesk.config.debug = true;

// Check if script loaded
console.log('Trackdesk loaded:', !!window.Trackdesk);

// Check event queue
console.log('Event queue:', window.Trackdesk.eventQueue);
```

This should give you a complete understanding of how the tracking system works and how to implement it properly!
