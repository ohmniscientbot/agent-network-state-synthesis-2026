
const NodeCache = require('node-cache');

class PerformanceCache {
    constructor() {
        // Different TTL for different data types
        this.agentsCache = new NodeCache({ stdTTL: 300 }); // 5 minutes
        this.metricsCache = new NodeCache({ stdTTL: 60 });  // 1 minute
        this.proposalsCache = new NodeCache({ stdTTL: 180 }); // 3 minutes
        this.activityCache = new NodeCache({ stdTTL: 30 });  // 30 seconds
    }
    
    // Agent caching
    cacheAgents(agents) {
        this.agentsCache.set('all_agents', agents);
        agents.forEach(agent => {
            this.agentsCache.set(`agent_${agent.id}`, agent);
        });
    }
    
    getCachedAgents() {
        return this.agentsCache.get('all_agents');
    }
    
    getCachedAgent(agentId) {
        return this.agentsCache.get(`agent_${agentId}`);
    }
    
    // Metrics caching
    cacheMetrics(metrics) {
        this.metricsCache.set('dashboard_metrics', metrics);
    }
    
    getCachedMetrics() {
        return this.metricsCache.get('dashboard_metrics');
    }
    
    // Activity caching
    cacheActivity(activities) {
        this.activityCache.set('recent_activity', activities);
    }
    
    getCachedActivity() {
        return this.activityCache.get('recent_activity');
    }
    
    // Cache invalidation
    invalidateAgent(agentId) {
        this.agentsCache.del(`agent_${agentId}`);
        this.agentsCache.del('all_agents');
        this.metricsCache.del('dashboard_metrics'); // Metrics depend on agents
    }
    
    invalidateMetrics() {
        this.metricsCache.del('dashboard_metrics');
    }
    
    invalidateActivity() {
        this.activityCache.del('recent_activity');
    }
    
    // Middleware for automatic caching
    cacheMiddleware(cacheKey, ttl = 300) {
        return (req, res, next) => {
            const cached = this.getCache(cacheKey).get(req.originalUrl);
            if (cached) {
                return res.json(cached);
            }
            
            // Override res.json to cache the response
            const originalJson = res.json;
            res.json = (data) => {
                this.getCache(cacheKey).set(req.originalUrl, data, ttl);
                return originalJson.call(res, data);
            };
            
            next();
        };
    }
    
    getCache(type) {
        switch (type) {
            case 'agents': return this.agentsCache;
            case 'metrics': return this.metricsCache;
            case 'activity': return this.activityCache;
            case 'proposals': return this.proposalsCache;
            default: return this.agentsCache;
        }
    }
    
    // Response compression helper
    static compress(data) {
        // Remove unnecessary fields for API responses
        if (Array.isArray(data)) {
            return data.map(item => this.compressItem(item));
        }
        return this.compressItem(data);
    }
    
    static compressItem(item) {
        if (!item || typeof item !== 'object') return item;
        
        // Remove large fields that aren't needed for most responses
        const compressed = { ...item };
        delete compressed.fullHistory;
        delete compressed.detailedLogs;
        delete compressed.internalState;
        
        return compressed;
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            requests: 0,
            totalResponseTime: 0,
            slowQueries: 0,
            errors: 0
        };
    }
    
    middleware() {
        return (req, res, next) => {
            const start = Date.now();
            
            res.on('finish', () => {
                const duration = Date.now() - start;
                this.metrics.requests++;
                this.metrics.totalResponseTime += duration;
                
                if (duration > 1000) { // Slow query > 1 second
                    this.metrics.slowQueries++;
                    console.warn(`Slow query: ${req.method} ${req.path} took ${duration}ms`);
                }
                
                if (res.statusCode >= 400) {
                    this.metrics.errors++;
                }
            });
            
            next();
        };
    }
    
    getStats() {
        const avgResponseTime = this.metrics.requests > 0 
            ? this.metrics.totalResponseTime / this.metrics.requests 
            : 0;
            
        return {
            ...this.metrics,
            avgResponseTime: Math.round(avgResponseTime),
            errorRate: this.metrics.requests > 0 
                ? (this.metrics.errors / this.metrics.requests * 100).toFixed(2) + '%'
                : '0%'
        };
    }
}

module.exports = { PerformanceCache, PerformanceMonitor };