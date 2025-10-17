/**
 * Trackdesk CDN Tracking Script
 * Version: 1.0.0
 * 
 * This script can be embedded on any website to track user interactions
 * and send data to the Trackdesk dashboard.
 */

(function() {
  'use strict';

  // Configuration
  const TRACKDESK_CONFIG = {
    apiUrl: 'http://localhost:3003/api', // Change to your API URL
    version: '1.0.0',
    debug: true, // Enable debug for testing
    batchSize: 10,
    flushInterval: 5000, // 5 seconds
    maxRetries: 3,
    retryDelay: 1000
  };

  // Global namespace
  window.Trackdesk = window.Trackdesk || {};

  // Event queue
  let eventQueue = [];
  let isInitialized = false;
  let sessionId = null;
  let userId = null;
  let websiteId = null;

  // Utility functions
  const utils = {
    generateId: () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
    
    getCurrentTime: () => new Date().toISOString(),
    
    getPageInfo: () => ({
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    }),

    getDeviceInfo: () => ({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }),

    getBrowserInfo: () => {
      const ua = navigator.userAgent;
      let browser = 'Unknown';
      let version = 'Unknown';

      if (ua.indexOf('Chrome') > -1) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
      } else if (ua.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
      } else if (ua.indexOf('Safari') > -1) {
        browser = 'Safari';
        version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
      } else if (ua.indexOf('Edge') > -1) {
        browser = 'Edge';
        version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
      }

      return { browser, version };
    },

    getLocationInfo: async () => {
      try {
        // This would typically use a geolocation service
        // For now, return basic info
        return {
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          latitude: null,
          longitude: null
        };
      } catch (error) {
        return {
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          latitude: null,
          longitude: null
        };
      }
    },

    log: (message, data = null) => {
      if (TRACKDESK_CONFIG.debug) {
        console.log(`[Trackdesk] ${message}`, data);
      }
    }
  };

  // Event tracking
  const tracker = {
    // Initialize tracking
    init: (config = {}) => {
      if (isInitialized) {
        utils.log('Trackdesk already initialized');
        return;
      }

      // Merge config
      Object.assign(TRACKDESK_CONFIG, config);
      
      // Generate session ID
      sessionId = utils.generateId();
      
      // Get website ID from script tag
      const script = document.querySelector('script[src*="trackdesk.js"]');
      if (script) {
        websiteId = script.getAttribute('data-website-id') || script.getAttribute('data-id');
      }

      if (!websiteId) {
        utils.log('Warning: No website ID found. Please add data-website-id to the script tag.');
        return;
      }

      isInitialized = true;
      utils.log('Trackdesk initialized', { sessionId, websiteId });

      // Track page view
      tracker.track('page_view', {
        page: utils.getPageInfo(),
        device: utils.getDeviceInfo(),
        browser: utils.getBrowserInfo()
      });

      // Set up event listeners
      tracker.setupEventListeners();

      // Start batch processing
      tracker.startBatchProcessing();
    },

    // Track custom event
    track: (eventName, eventData = {}) => {
      if (!isInitialized) {
        utils.log('Trackdesk not initialized. Call Trackdesk.init() first.');
        return;
      }

      const event = {
        id: utils.generateId(),
        event: eventName,
        data: eventData,
        timestamp: utils.getCurrentTime(),
        sessionId: sessionId,
        userId: userId,
        websiteId: websiteId,
        page: utils.getPageInfo(),
        device: utils.getDeviceInfo(),
        browser: utils.getBrowserInfo()
      };

      eventQueue.push(event);
      utils.log('Event tracked', event);

      // Flush if queue is full
      if (eventQueue.length >= TRACKDESK_CONFIG.batchSize) {
        tracker.flush();
      }
    },

    // Set user ID
    identify: (id, userData = {}) => {
      userId = id;
      tracker.track('user_identified', {
        userId: id,
        userData: userData
      });
    },

    // Track conversion
    convert: (conversionData = {}) => {
      tracker.track('conversion', conversionData);
    },

    // Set up automatic event listeners
    setupEventListeners: () => {
      // Page visibility changes
      document.addEventListener('visibilitychange', () => {
        tracker.track('visibility_change', {
          hidden: document.hidden,
          visibilityState: document.visibilityState
        });
      });

      // Page unload
      window.addEventListener('beforeunload', () => {
        tracker.track('page_unload', {
          page: utils.getPageInfo()
        });
        tracker.flush(true); // Force flush on unload
      });

      // Click tracking
      document.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.tagName) {
          tracker.track('click', {
            element: {
              tagName: target.tagName,
              id: target.id,
              className: target.className,
              text: target.textContent?.substring(0, 100),
              href: target.href,
              type: target.type
            },
            position: {
              x: e.clientX,
              y: e.clientY
            }
          });
        }
      });

      // Form submissions
      document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form && form.tagName === 'FORM') {
          tracker.track('form_submit', {
            form: {
              id: form.id,
              className: form.className,
              action: form.action,
              method: form.method,
              fieldCount: form.elements.length
            }
          });
        }
      });

      // Scroll tracking
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
          );
          tracker.track('scroll', {
            scrollPercent: scrollPercent,
            scrollY: window.scrollY,
            scrollHeight: document.body.scrollHeight
          });
        }, 100);
      });

      // Time on page tracking
      let timeOnPage = 0;
      setInterval(() => {
        timeOnPage += 1;
        if (timeOnPage % 30 === 0) { // Track every 30 seconds
          tracker.track('time_on_page', {
            seconds: timeOnPage
          });
        }
      }, 1000);
    },

    // Start batch processing
    startBatchProcessing: () => {
      setInterval(() => {
        if (eventQueue.length > 0) {
          tracker.flush();
        }
      }, TRACKDESK_CONFIG.flushInterval);
    },

    // Flush events to server
    flush: async (force = false) => {
      if (eventQueue.length === 0) return;

      const events = [...eventQueue];
      eventQueue = [];

      try {
        await tracker.sendEvents(events);
        utils.log('Events flushed successfully', { count: events.length });
      } catch (error) {
        utils.log('Failed to flush events', error);
        // Re-add events to queue for retry
        eventQueue.unshift(...events);
      }
    },

    // Send events to server
    sendEvents: async (events) => {
      const payload = {
        events: events,
        websiteId: websiteId,
        sessionId: sessionId,
        timestamp: utils.getCurrentTime()
      };

      const response = await fetch(`${TRACKDESK_CONFIG.apiUrl}/tracking/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Trackdesk-Version': TRACKDESK_CONFIG.version
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    }
  };

  // Public API
  window.Trackdesk = {
    init: tracker.init,
    track: tracker.track,
    identify: tracker.identify,
    convert: tracker.convert,
    flush: tracker.flush,
    config: TRACKDESK_CONFIG
  };

  // Auto-initialize if data-auto-init is present
  const script = document.querySelector('script[src*="trackdesk.js"]');
  if (script && script.getAttribute('data-auto-init') !== 'false') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        tracker.init();
      });
    } else {
      tracker.init();
    }
  }

  utils.log('Trackdesk script loaded');
})();
