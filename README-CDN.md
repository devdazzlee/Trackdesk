# Trackdesk CDN Tracking System

## Overview
Trackdesk CDN is a comprehensive website tracking and analytics system that can be easily integrated into any website. It provides real-time analytics, user behavior tracking, and detailed insights through a simple JavaScript snippet.

## Features

### 🚀 Core Tracking
- **Page Views**: Track page visits and navigation patterns
- **Click Tracking**: Monitor user interactions and clicks
- **Scroll Tracking**: Measure engagement and content consumption
- **Form Tracking**: Track form submissions and interactions
- **Conversion Tracking**: Monitor goal completions and conversions
- **Custom Events**: Track any custom user actions

### 📊 Analytics & Insights
- **Real-time Dashboard**: Live analytics and user activity
- **Performance Metrics**: Page load times, bounce rates, session duration
- **User Journey**: Complete user flow and behavior analysis
- **Heatmaps**: Visual representation of user interactions
- **Funnel Analysis**: Conversion funnel tracking and optimization
- **Cohort Analysis**: User retention and engagement over time

### 🔒 Privacy & Security
- **GDPR Compliant**: Respects user privacy and data protection
- **Do Not Track**: Honors browser DNT settings
- **IP Anonymization**: Optional IP address anonymization
- **Data Encryption**: Secure data transmission and storage
- **Access Control**: Role-based permissions and API keys

### 🌐 Multi-Website Support
- **Multiple Properties**: Track unlimited websites
- **Cross-Domain Tracking**: Track users across multiple domains
- **White-label**: Customizable branding and domains
- **API Access**: RESTful API for custom integrations

## Quick Start

### 1. Installation

#### Option A: CDN (Recommended)
```html
<!-- Add this to your website's <head> section -->
<script src="https://cdn.trackdesk.com/trackdesk.js" 
        data-website-id="your-website-id" 
        data-auto-init="true">
</script>
```

#### Option B: Self-Hosted
```bash
# Clone the repository
git clone https://github.com/your-org/trackdesk.git
cd trackdesk

# Start with Docker Compose
docker-compose up -d

# Or install manually
cd backend && npm install && npm start
cd frontend && npm install && npm start
```

### 2. Configuration

#### Get Your Website ID
1. Sign up at [Trackdesk Dashboard](https://dashboard.trackdesk.com)
2. Add your website
3. Copy the tracking code with your unique website ID

#### Basic Setup
```html
<script src="https://cdn.trackdesk.com/trackdesk.js" 
        data-website-id="web_abc123" 
        data-auto-init="true">
</script>
```

#### Advanced Configuration
```html
<script>
  window.Trackdesk = window.Trackdesk || {};
  window.Trackdesk.config = {
    apiUrl: 'https://api.trackdesk.com',
    debug: false,
    batchSize: 10,
    flushInterval: 5000,
    respectDoNotTrack: true,
    anonymizeIP: false
  };
</script>
<script src="https://cdn.trackdesk.com/trackdesk.js" 
        data-website-id="web_abc123" 
        data-auto-init="true">
</script>
```

### 3. Custom Events

#### Track Custom Events
```javascript
// Track a purchase
Trackdesk.track('purchase', {
  product: 'Premium Plan',
  value: 99.99,
  currency: 'USD',
  category: 'Software'
});

// Track user signup
Trackdesk.track('signup', {
  method: 'email',
  plan: 'free',
  source: 'homepage'
});

// Track button clicks
document.getElementById('cta-button').addEventListener('click', function() {
  Trackdesk.track('cta_click', {
    button: 'Get Started',
    page: window.location.pathname,
    position: 'header'
  });
});
```

#### User Identification
```javascript
// Identify a user
Trackdesk.identify('user_123', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'premium',
  signupDate: '2024-01-01'
});

// Track conversions
Trackdesk.convert({
  type: 'purchase',
  value: 99.99,
  currency: 'USD',
  product: 'Premium Plan'
});
```

## Dashboard Features

### 📈 Real-time Analytics
- Live user activity
- Current page views
- Active sessions
- Real-time events

### 📊 Performance Metrics
- Page views and unique visitors
- Bounce rate and session duration
- Conversion rates
- Traffic sources

### 🗺️ User Journey
- Complete user flow
- Page-to-page navigation
- Time spent on each page
- Exit points and drop-offs

### 🔥 Heatmaps
- Click heatmaps
- Scroll depth analysis
- User interaction patterns
- Content engagement

### 🎯 Funnel Analysis
- Conversion funnels
- Step-by-step analysis
- Drop-off identification
- Optimization recommendations

## API Reference

### Tracking API

#### Track Event
```javascript
POST /api/tracking/events
Content-Type: application/json

{
  "events": [
    {
      "id": "evt_123",
      "event": "page_view",
      "data": {
        "page": "/products",
        "title": "Products Page"
      },
      "timestamp": "2024-01-07T14:30:00Z",
      "sessionId": "sess_456",
      "websiteId": "web_abc123"
    }
  ],
  "websiteId": "web_abc123",
  "sessionId": "sess_456"
}
```

#### Get Analytics
```javascript
GET /api/tracking/stats/web_abc123?startDate=2024-01-01&endDate=2024-01-07

Response:
{
  "websiteId": "web_abc123",
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-07"
  },
  "stats": [
    {
      "date": "2024-01-01",
      "pageViews": 1200,
      "uniqueVisitors": 800,
      "conversions": 24
    }
  ],
  "summary": {
    "totalPageViews": 8400,
    "totalUniqueVisitors": 5600,
    "totalConversions": 168
  }
}
```

### Management API

#### Create Website
```javascript
POST /api/websites
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "name": "My Website",
  "domain": "example.com",
  "description": "My awesome website",
  "settings": {
    "trackClicks": true,
    "trackScrolls": true,
    "trackForms": true,
    "trackPageViews": true,
    "trackConversions": true
  }
}
```

#### Get Websites
```javascript
GET /api/websites
Authorization: Bearer your-api-key

Response:
{
  "websites": [
    {
      "id": "web_abc123",
      "name": "My Website",
      "domain": "example.com",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Configuration Options

### Script Configuration
```javascript
window.Trackdesk.config = {
  // API endpoint
  apiUrl: 'https://api.trackdesk.com',
  
  // Script version
  version: '1.0.0',
  
  // Debug mode
  debug: false,
  
  // Event batching
  batchSize: 10,
  flushInterval: 5000,
  
  // Privacy settings
  respectDoNotTrack: true,
  anonymizeIP: false,
  
  // Tracking settings
  trackClicks: true,
  trackScrolls: true,
  trackForms: true,
  trackPageViews: true,
  trackConversions: true,
  
  // Retry settings
  maxRetries: 3,
  retryDelay: 1000
};
```

### HTML Attributes
```html
<script src="https://cdn.trackdesk.com/trackdesk.js" 
        data-website-id="web_abc123"
        data-auto-init="true"
        data-debug="false"
        data-respect-dnt="true"
        data-anonymize-ip="false">
</script>
```

## Privacy & Compliance

### GDPR Compliance
- User consent management
- Data processing agreements
- Right to be forgotten
- Data portability
- Privacy by design

### Data Retention
- Configurable retention periods
- Automatic data cleanup
- Export capabilities
- Secure data deletion

### Security Features
- HTTPS encryption
- API key authentication
- Rate limiting
- Input validation
- SQL injection protection

## Deployment Options

### 1. Cloud CDN (Recommended)
- **AWS CloudFront**: Global CDN with edge locations
- **Cloudflare**: DDoS protection and performance
- **Vercel**: Serverless deployment
- **Netlify**: Static site hosting

### 2. Self-Hosted
- **Docker**: Containerized deployment
- **Kubernetes**: Scalable orchestration
- **VPS**: Virtual private server
- **Dedicated Server**: Full control

### 3. Hybrid
- **CDN + Self-hosted API**: Best of both worlds
- **Multi-region**: Global availability
- **Failover**: High availability

## Performance

### Optimization Features
- **Event Batching**: Reduce API calls
- **Compression**: Gzip compression
- **Caching**: Smart caching strategies
- **CDN**: Global content delivery
- **Database Indexing**: Fast queries

### Monitoring
- **Health Checks**: Service monitoring
- **Performance Metrics**: Response times
- **Error Tracking**: Issue detection
- **Uptime Monitoring**: Availability tracking

## Support

### Documentation
- [API Documentation](https://docs.trackdesk.com/api)
- [Integration Guide](https://docs.trackdesk.com/integration)
- [Privacy Policy](https://docs.trackdesk.com/privacy)
- [Terms of Service](https://docs.trackdesk.com/terms)

### Community
- [GitHub Repository](https://github.com/your-org/trackdesk)
- [Discord Community](https://discord.gg/trackdesk)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/trackdesk)

### Support Channels
- **Email**: support@trackdesk.com
- **Live Chat**: Available in dashboard
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides

## Pricing

### Free Tier
- Up to 10,000 page views/month
- Basic analytics
- 30-day data retention
- Community support

### Pro Tier
- Up to 100,000 page views/month
- Advanced analytics
- 1-year data retention
- Priority support
- Custom events

### Enterprise
- Unlimited page views
- Custom analytics
- Unlimited data retention
- Dedicated support
- White-label options
- SLA guarantees

## Changelog

### Version 1.0.0 (2024-01-07)
- Initial release
- Basic tracking functionality
- Real-time dashboard
- API endpoints
- Docker support

### Upcoming Features
- A/B testing
- Advanced segmentation
- Machine learning insights
- Mobile app tracking
- E-commerce tracking
- Social media integration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Security

If you discover a security vulnerability, please report it to security@trackdesk.com.

## Acknowledgments

- Built with ❤️ by the Trackdesk Team
- Powered by modern web technologies
- Inspired by the open-source community
