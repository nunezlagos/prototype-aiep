const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { logger } = require('./src/helpers/logger');
const { securityMiddleware } = require('./src/middlewares/auth');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');

const app = express();
const PORT = process.env.PORT || 7777;

// Middleware básico
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de sesión
app.use(session({
    secret: 'clinica-oftalmologica-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware de seguridad
app.use(securityMiddleware);

// Archivos estáticos
app.use(express.static('src/public'));

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

// Rutas de la aplicación
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Middleware para rutas no encontradas
app.use((req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    logger.logUnauthorizedAccess(clientIP, req.originalUrl);
    res.status(404).json({ error: 'Página no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    logger.logSystemError(`Server error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo global de errores no capturados
process.on('uncaughtException', (error) => {
    logger.logSystemError(`Uncaught Exception: ${error.message}`, { 
        stack: error.stack,
        type: 'uncaughtException'
    });
    console.error('💥 Error crítico no capturado:', error.message);
    // No salir del proceso para mantener el servidor funcionando
});

process.on('unhandledRejection', (reason, promise) => {
    logger.logSystemError(`Unhandled Promise Rejection: ${reason}`, { 
        promise: promise.toString(),
        type: 'unhandledRejection'
    });
    console.error('⚠️ Promesa rechazada no manejada:', reason);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('=== CLÍNICA OFTALMOLÓGICA MÍRAME ===');
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('📋 Credenciales de acceso:');
    console.log('   👨‍⚕️ Administrador: admin / clinica123');
    console.log('   👩‍⚕️ Doctor: doctor1 / oftalmologia456');
    console.log('   👩‍💼 Secretaria: secretaria / recepcion789');
    console.log('❌ Credenciales inválidas para pruebas: test / test123');
    console.log('📊 Sistema de logging activo');
    console.log('🛡️ Manejo global de errores activado');
    console.log('=====================================');
});

module.exports = app;