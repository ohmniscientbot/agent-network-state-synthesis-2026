
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');

// Rate limiting
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { error: message },
        standardHeaders: true,
        legacyHeaders: false
    });
};

// Different rate limits for different endpoints
const rateLimits = {
    general: createRateLimit(15 * 60 * 1000, 100, 'Too many requests'),
    auth: createRateLimit(15 * 60 * 1000, 5, 'Too many auth attempts'),
    api: createRateLimit(60 * 1000, 30, 'Too many API calls'),
    registration: createRateLimit(60 * 60 * 1000, 3, 'Too many registrations')
};

// Input validation middleware
const validateInput = (schema) => {
    return (req, res, next) => {
        const errors = [];
        
        for (const [field, rules] of Object.entries(schema)) {
            const value = req.body[field];
            
            if (rules.required && (!value || value.trim() === '')) {
                errors.push(`${field} is required`);
                continue;
            }
            
            if (value) {
                if (rules.maxLength && value.length > rules.maxLength) {
                    errors.push(`${field} too long (max ${rules.maxLength})`);
                }
                
                if (rules.isEmail && !validator.isEmail(value)) {
                    errors.push(`${field} must be valid email`);
                }
                
                if (rules.isAddress && !validator.matches(value, /^0x[a-fA-F0-9]{40}$/)) {
                    errors.push(`${field} must be valid Ethereum address`);
                }
                
                if (rules.sanitize) {
                    req.body[field] = validator.escape(value);
                }
            }
        }
        
        if (errors.length > 0) {
            return res.status(400).json({ error: 'Validation failed', details: errors });
        }
        
        next();
    };
};

// Security schemas for different endpoints
const schemas = {
    agentRegistration: {
        name: { required: true, maxLength: 50, sanitize: true },
        address: { required: true, isAddress: true },
        agentType: { required: true, maxLength: 30, sanitize: true },
        harness: { maxLength: 30, sanitize: true }
    },
    contribution: {
        agentId: { required: true, maxLength: 100 },
        type: { required: true, maxLength: 50, sanitize: true },
        evidence: { required: true, maxLength: 500, sanitize: true }
    },
    proposal: {
        title: { required: true, maxLength: 200, sanitize: true },
        description: { required: true, maxLength: 2000, sanitize: true },
        agentId: { required: true, maxLength: 100 }
    }
};

// Security headers
const securityHeaders = helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
});

module.exports = {
    rateLimits,
    validateInput,
    schemas,
    securityHeaders
};