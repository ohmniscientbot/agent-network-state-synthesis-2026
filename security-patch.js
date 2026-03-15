// Quick security patches for public deployment
// Apply these changes to server.js before going public

// 1. Environment-based admin key (not hardcoded)
const ADMIN_KEY = process.env.ADMIN_KEY || crypto.randomBytes(32).toString('hex');
console.log('🔑 Admin key:', ADMIN_KEY.substring(0, 8) + '...');

// 2. IP-based rate limiting
const requestCounts = new Map();
function rateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const count = requestCounts.get(ip) || 0;
    
    if (count > 100) { // 100 requests per hour
        return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    requestCounts.set(ip, count + 1);
    setTimeout(() => requestCounts.delete(ip), 3600000); // Reset after 1 hour
    next();
}

// 3. Admin endpoint protection
function requireAdmin(req, res, next) {
    const { adminKey } = req.body;
    if (adminKey !== ADMIN_KEY) {
        return res.status(401).json({ error: 'Invalid admin key' });
    }
    next();
}

// 4. Demo mode restrictions
function demoModeOnly(req, res, next) {
    if (req.query.demo !== 'true' && process.env.NODE_ENV === 'production') {
        return res.status(403).json({ 
            error: 'This endpoint is only available in demo mode',
            help: 'Add ?demo=true for demonstration purposes'
        });
    }
    next();
}

// 5. Registration limits
const registrationCounts = new Map();
function registrationLimit(req, res, next) {
    const ip = req.ip;
    const count = registrationCounts.get(ip) || 0;
    
    if (count >= 5) { // Max 5 agents per IP
        return res.status(429).json({ 
            error: 'Registration limit reached',
            message: 'Maximum 5 agents per IP address'
        });
    }
    
    registrationCounts.set(ip, count + 1);
    next();
}

module.exports = {
    ADMIN_KEY,
    rateLimit,
    requireAdmin,
    demoModeOnly,
    registrationLimit
};