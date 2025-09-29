const { logger } = require('../helpers/logger');

/**
 * Middleware de autenticación
 */
function requireAuth(req, res, next) {
    try {
        if (!req.session.user) {
            const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
            logger.logUnauthorizedAccess(clientIP, req.originalUrl);
            return res.status(401).json({ error: 'Acceso no autorizado. Debe iniciar sesión.' });
        }
        next();
    } catch (error) {
        logger.logSystemError(`Auth middleware error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

/**
 * Middleware de seguridad
 */
function securityMiddleware(req, res, next) {
    try {
        // Security headers para cumplimiento OWASP Top 10
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com");
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Rate limiting básico
        if (!req.session.requestCount) {
            req.session.requestCount = 1;
            req.session.requestTime = Date.now();
        } else {
            req.session.requestCount++;
            if (req.session.requestCount > 100 && (Date.now() - req.session.requestTime) < 60000) {
                return res.status(429).json({ error: 'Demasiadas solicitudes' });
            }
            if ((Date.now() - req.session.requestTime) > 60000) {
                req.session.requestCount = 1;
                req.session.requestTime = Date.now();
            }
        }
        
        next();
    } catch (error) {
        logger.logSystemError(`Security middleware error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { requireAuth, securityMiddleware };