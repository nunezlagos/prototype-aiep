# Ejemplos de Implementación - Función Global logError()

## Descripción
Esta guía muestra cómo usar la nueva función global `logError()` que detecta automáticamente el tipo de error y registra toda la información necesaria.

## Función Global logError()

### Sintaxis Básica
```javascript
const { logger } = require('./helpers/logger');

try {
    // Tu código aquí
} catch (error) {
    logger.logError(error, { req, action: 'nombre_accion' });
}
```

### Detección Automática de Tipos de Error
La función detecta automáticamente estos tipos:
- `LOGIN_ERROR` - Errores de autenticación
- `UNAUTHORIZED_ACCESS` - Acceso no autorizado
- `SECURITY_THREAT` - Amenazas de seguridad
- `SYSTEM_ERROR` - Errores del sistema
- `VALIDATION_ERROR` - Errores de validación
- `AUTHENTICATION_ERROR` - Errores de autenticación
- `AUTHORIZATION_ERROR` - Errores de autorización
- `DATABASE_ERROR` - Errores de base de datos

## Ejemplos Prácticos

### 1. Controlador de Autenticación
```javascript
const { logger } = require('../helpers/logger');

class AuthController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            
            // Validación
            if (!username || !password) {
                throw new Error('VALIDATION_ERROR: Username and password required');
            }
            
            // Buscar usuario
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('LOGIN_ERROR: User not found');
            }
            
            // Verificar contraseña
            if (!bcrypt.compareSync(password, user.password)) {
                throw new Error('LOGIN_ERROR: Invalid password');
            }
            
            // Login exitoso
            res.json({ success: true, user });
            
        } catch (error) {
            // ✅ Una sola línea - detecta automáticamente el tipo
            logger.logError(error, { req, action: 'login' });
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
```

### 2. Middleware de Seguridad
```javascript
const { logger } = require('../helpers/logger');

function securityMiddleware(req, res, next) {
    try {
        const userAgent = req.get('User-Agent');
        
        // Detectar bots maliciosos
        if (userAgent && userAgent.includes('malicious')) {
            throw new Error('SECURITY_THREAT: Malicious bot detected');
        }
        
        // Verificar rate limiting
        if (isRateLimited(req.ip)) {
            throw new Error('SECURITY_THREAT: Rate limit exceeded');
        }
        
        next();
        
    } catch (error) {
        // ✅ Detecta automáticamente SECURITY_THREAT
        logger.logError(error, { req, middleware: 'security' });
        res.status(403).json({ error: 'Acceso denegado' });
    }
}
```

### 3. Operaciones de Base de Datos
```javascript
const { logger } = require('../helpers/logger');

class UserService {
    static async createUser(userData, req) {
        try {
            // Validar datos
            if (!userData.email || !userData.password) {
                throw new Error('VALIDATION_ERROR: Email and password required');
            }
            
            // Crear usuario
            const user = new User(userData);
            await user.save();
            
            return user;
            
        } catch (error) {
            // ✅ Detecta automáticamente DATABASE_ERROR si es error de MongoDB
            logger.logError(error, { req, action: 'create_user', userData: { email: userData.email } });
            throw error;
        }
    }
    
    static async getUserById(id, req) {
        try {
            const user = await User.findById(id);
            
            if (!user) {
                throw new Error('User not found');
            }
            
            return user;
            
        } catch (error) {
            // ✅ Una sola línea para cualquier error
            logger.logError(error, { req, action: 'get_user', userId: id });
            throw error;
        }
    }
}
```

### 4. Rutas con Autorización
```javascript
const { logger } = require('../helpers/logger');

router.get('/admin/users', (req, res) => {
    try {
        // Verificar autorización
        if (!req.session.user || req.session.user.role !== 'admin') {
            throw new Error('AUTHORIZATION_ERROR: Admin access required');
        }
        
        // Obtener usuarios
        const users = User.find({});
        res.json(users);
        
    } catch (error) {
        // ✅ Detecta automáticamente AUTHORIZATION_ERROR
        logger.logError(error, { req, action: 'list_users' });
        res.status(403).json({ error: 'Acceso no autorizado' });
    }
});
```

### 5. Procesamiento de Archivos
```javascript
const { logger } = require('../helpers/logger');

function uploadFile(req, res) {
    try {
        const file = req.file;
        
        if (!file) {
            throw new Error('VALIDATION_ERROR: No file provided');
        }
        
        // Verificar tipo de archivo
        if (!file.mimetype.startsWith('image/')) {
            throw new Error('VALIDATION_ERROR: Only images allowed');
        }
        
        // Procesar archivo
        const result = processFile(file);
        res.json({ success: true, result });
        
    } catch (error) {
        // ✅ Detecta automáticamente el tipo según el mensaje
        logger.logError(error, { req, action: 'upload_file', filename: req.file?.originalname });
        res.status(400).json({ error: 'Error procesando archivo' });
    }
}
```

## Ventajas de la Función Global

### ✅ Antes (Múltiples funciones)
```javascript
catch (error) {
    if (error.message.includes('login')) {
        logger.logLoginError(username, req.ip, { error: error.message });
    } else if (error.message.includes('security')) {
        logger.logSecurityThreat('UNKNOWN', error.message, req.ip, req.originalUrl);
    } else {
        logger.logSystemError(error.message, { stack: error.stack });
    }
}
```

### ✅ Ahora (Una sola función)
```javascript
catch (error) {
    logger.logError(error, { req, action: 'operation_name' });
}
```

## Información Capturada Automáticamente

La función global captura automáticamente:
- **Timestamp** preciso
- **Tipo de error** (detectado automáticamente)
- **Mensaje de error**
- **Stack trace** completo
- **IP del cliente** (si se proporciona req)
- **Método HTTP** (GET, POST, etc.)
- **URL solicitada**
- **User Agent**
- **ID de usuario** (si está en sesión)
- **Información adicional** del contexto

## Mejores Prácticas

### 1. Siempre usar try-catch
```javascript
// ✅ CORRECTO
try {
    // código que puede fallar
} catch (error) {
    logger.logError(error, { req, action: 'action_name' });
}
```

### 2. Proporcionar contexto útil
```javascript
// ✅ CORRECTO - Con contexto
logger.logError(error, { 
    req, 
    action: 'create_user', 
    userId: user.id,
    email: user.email 
});
```

### 3. Usar nombres de acción descriptivos
```javascript
// ✅ CORRECTO
logger.logError(error, { req, action: 'validate_payment' });
logger.logError(error, { req, action: 'send_email' });
logger.logError(error, { req, action: 'process_image' });
```

## Comandos de Verificación

### Ejecutar tests
```bash
cd src
node test.js
```

### Ver logs generados
```bash
# Windows
type logs\Log_Excepciones_*.txt

# Linux/Mac
cat logs/Log_Excepciones_*.txt
```

### Iniciar servidor
```bash
cd src
node server.js
```

## Conclusión

La función global `logError()` simplifica enormemente el logging:
- **Una sola función** para todos los errores
- **Detección automática** del tipo de error
- **Información completa** capturada automáticamente
- **Fácil de usar** en cualquier try-catch
- **Cumple 100%** con los requisitos AIEP

¡Ahora solo necesitas recordar una función: `logger.logError(error, context)`!