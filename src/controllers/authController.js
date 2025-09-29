const bcrypt = require('bcryptjs');
const { logger } = require('../helpers/logger');

// Usuarios del sistema
const users = [
    {
        username: 'admin',
        password: bcrypt.hashSync('clinica123', 10),
        name: 'Dr. Juan Pérez',
        role: 'Administrador',
        email: 'admin@clinicamirame.cl'
    },
    {
        username: 'doctor1',
        password: bcrypt.hashSync('oftalmologia456', 10),
        name: 'Dra. María González',
        role: 'Oftalmólogo',
        email: 'maria.gonzalez@clinicamirame.cl'
    },
    {
        username: 'secretaria',
        password: bcrypt.hashSync('recepcion789', 10),
        name: 'Ana López',
        role: 'Secretaria',
        email: 'ana.lopez@clinicamirame.cl'
    }
];

class AuthController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
            const userAgent = req.get('User-Agent') || 'unknown';

            // Validación de entrada
            if (!username || !password) {
                logger.logLoginError(username || 'empty', clientIP, { reason: 'Missing credentials' });
                return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
            }

            // Detección de ataques de inyección SQL
            const sqlPatterns = [/'/, /union/i, /select/i, /drop/i, /insert/i, /delete/i, /update/i, /--/, /\/\*/, /\*\//];
            const xssPatterns = [/<script/i, /javascript:/i, /on\w+=/i, /<iframe/i, /<object/i];
            
            const suspiciousInput = [username, password].join(' ');
            
            if (sqlPatterns.some(pattern => pattern.test(suspiciousInput))) {
                logger.logSecurityThreat('SQL_INJECTION', suspiciousInput, clientIP, req.originalUrl);
                return res.status(400).json({ error: 'Entrada no válida detectada' });
            }
            
            if (xssPatterns.some(pattern => pattern.test(suspiciousInput))) {
                logger.logSecurityThreat('XSS_ATTEMPT', suspiciousInput, clientIP, req.originalUrl);
                return res.status(400).json({ error: 'Entrada no válida detectada' });
            }

            // Buscar usuario
            const user = users.find(u => u.username === username);
            
            if (!user || !bcrypt.compareSync(password, user.password)) {
                logger.logLoginError(username, clientIP, { reason: 'Invalid credentials' });
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Login exitoso
            req.session.user = {
                username: user.username,
                name: user.name,
                role: user.role,
                email: user.email
            };

            res.json({
                success: true,
                message: 'Login exitoso',
                user: req.session.user
            });

        } catch (error) {
            logger.logSystemError(`Login error: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static logout(req, res) {
        try {
            const username = req.session.user?.username || 'unknown';
            req.session.destroy((err) => {
                if (err) {
                    logger.logSystemError(`Logout error: ${err.message}`, { username });
                    return res.status(500).json({ error: 'Error al cerrar sesión' });
                }
                res.json({ success: true, message: 'Sesión cerrada exitosamente' });
            });
        } catch (error) {
            logger.logSystemError(`Logout error: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static getUser(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            res.json({ user: req.session.user });
        } catch (error) {
            logger.logSystemError(`Get user error: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = AuthController;