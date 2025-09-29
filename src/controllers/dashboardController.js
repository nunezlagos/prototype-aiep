const path = require('path');
const { logger } = require('../helpers/logger');

class DashboardController {
    static getDashboard(req, res) {
        try {
            const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
            const userAgent = req.get('User-Agent') || 'unknown';
            
            // Verificar parámetros sospechosos en la URL
            const queryString = req.url.split('?')[1] || '';
            const suspiciousPatterns = [
                /'/, /union/i, /select/i, /drop/i, /insert/i, /delete/i, /update/i, /--/, /\/\*/, /\*\//,
                /<script/i, /javascript:/i, /on\w+=/i, /<iframe/i, /<object/i, /alert\(/i
            ];
            
            if (suspiciousPatterns.some(pattern => pattern.test(queryString))) {
                logger.logError('Malicious parameters detected', { req, type: 'SECURITY_THREAT', queryString });
                return res.status(400).json({ error: 'Parámetros no válidos detectados' });
            }

            // Servir el dashboard
            res.sendFile(path.join(__dirname, '../views/dashboard.html'));
            
        } catch (error) {
            logger.logError(error, { req, type: 'SYSTEM_ERROR' });
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static handleSupportEvent(req, res) {
        try {
            const { eventType, description } = req.body;
            const userInfo = req.session.user?.username || 'anonymous';
            
            if (!eventType || !description) {
                return res.status(400).json({ error: 'Tipo de evento y descripción son requeridos' });
            }

            logger.logError(eventType, { req, type: 'SUPPORT_EVENT', userInfo, description });
            
            res.json({
                success: true,
                message: 'Evento de soporte registrado exitosamente',
                eventId: Date.now().toString()
            });
            
        } catch (error) {
            logger.logError(error, { req, type: 'SYSTEM_ERROR' });
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = DashboardController;