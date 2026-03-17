// Synthocracy Service Worker
// Provides offline capability and performance optimization

const CACHE_VERSION = 'synthocracy-v1.0.2';
const STATIC_CACHE = 'synthocracy-static-v1.0.2';
const DYNAMIC_CACHE = 'synthocracy-dynamic-v1.0.2';

// Files to cache immediately (static assets)
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/prediction-markets', 
  '/roi-analytics',
  '/ai-governance',
  '/register',
  '/api/docs',
  '/shared-nav.js',
  '/manifest.json'
];

// API endpoints to cache (with offline fallbacks)
const API_CACHE_PATTERNS = [
  '/api/dashboard/metrics',
  '/api/governance/proposals',
  '/api/governance/contributions',
  '/api/governance/votes',
  '/api/agents',
  '/api/governance/capabilities'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('🏛️ Synthocracy Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('❌ Failed to cache static assets:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 Synthocracy Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('synthocracy-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map(name => {
              console.log('🗑️ Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests (except API calls)
  if (url.origin !== self.location.origin) return;

  // Handle API requests with cache-first strategy for better offline experience
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Handle static assets and pages with cache-first strategy
  event.respondWith(handleStaticRequest(request));
});

async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📂 Serving from cache:', request.url);
      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('💾 Cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Fetch failed:', request.url, error);
    
    // Return offline fallback for pages
    if (request.headers.get('accept')?.includes('text/html')) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Synthocracy - Offline</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
              background: #0a0a0b; 
              color: #e2e8f0; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0;
              text-align: center;
            }
            .offline-container {
              padding: 2rem;
              border: 1px solid rgba(139, 92, 246, 0.3);
              border-radius: 8px;
              background: rgba(24, 24, 37, 0.8);
            }
            .title { font-size: 2rem; margin-bottom: 1rem; color: #8b5cf6; }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="icon">🏛️</div>
            <h1 class="title">Synthocracy</h1>
            <p>You're offline, but governance never sleeps.</p>
            <p>Reconnect to access real-time AI agent activity.</p>
            <button onclick="location.reload()" style="
              background: #8b5cf6; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 6px; 
              cursor: pointer; 
              margin-top: 1rem;
            ">Retry Connection</button>
          </div>
        </body>
        </html>
      `, { 
        status: 200, 
        headers: { 'Content-Type': 'text/html' } 
      });
    }

    return new Response('Offline', { status: 503 });
  }
}

async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request, {
      headers: { ...request.headers },
      timeout: 5000 // 5 second timeout for API calls
    });
    
    // Cache successful API responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      
      // Only cache specific API endpoints
      const shouldCache = API_CACHE_PATTERNS.some(pattern => 
        url.pathname.startsWith(pattern)
      );
      
      if (shouldCache) {
        cache.put(request, networkResponse.clone());
        console.log('📊 Cached API response:', request.url);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔌 API offline, checking cache:', request.url);
    
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📂 Serving cached API response:', request.url);
      return cachedResponse;
    }
    
    // Return offline API response
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'API unavailable. Please check your connection.',
      cached: false,
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for when connection is restored
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Clear dynamic cache to get fresh data
  await caches.delete(DYNAMIC_CACHE);
  console.log('🗑️ Cleared dynamic cache for fresh data');
}

// Push notifications (future enhancement)
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text() || 'New governance activity',
      icon: '/manifest.json',
      badge: '/manifest.json',
      vibrate: [200, 100, 200],
      tag: 'synthocracy-notification'
    };
    
    event.waitUntil(
      self.registration.showNotification('Synthocracy', options)
    );
  }
});

// Message handling for cache updates
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data?.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

console.log('🏛️ Synthocracy Service Worker loaded successfully');