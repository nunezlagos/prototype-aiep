# Sistema de Logging - Clínica Oftalmológica Mírame

## Introducción

Este documento presenta el prototipo de sistema de logging desarrollado para la **Clínica Oftalmológica Mírame**, como respuesta a los requerimientos establecidos por AIEP para el manejo de registro de errores y excepciones en aplicaciones web y de escritorio.

### Contexto del Proyecto

La clínica oftalmológica mírame cuenta con una aplicación web y una aplicación de escritorio en Windows, estas aplicaciones no cuentan con un manejo de registro de errores, LOG. Como informático se ha desarrollado este prototipo de aplicación web que contiene un LOG de errores o excepciones, para después evaluar la posibilidad de aplicar a estos sistemas existentes.

## Objetivos del Sistema

El sistema de logging implementado cumple con los siguientes objetivos específicos:

1. **Crear un archivo plano físico** con formato `Log_Excepciones_yyyyMMdd.txt`
2. **Generar errores dentro de try-catch** y escribir en el archivo creado
3. **Registrar la hora del error** en cada entrada del log
4. **Documentar el error generado** en la aplicación con detalles completos
5. **Escribir múltiples errores** con diferentes horas en el mismo archivo
6. **Crear nuevos archivos** cuando se generen errores en días diferentes

## Características Técnicas

### Formato del Archivo de Log

- **Nombre**: `Log_Excepciones_yyyyMMdd.txt`
- **Ubicación**: Carpeta `logs/` en el directorio del proyecto
- **Formato de entrada**: `[timestamp] [tipo_error] mensaje | información_adicional`

### Tipos de Errores Registrados

1. **LOGIN_ERROR**: Errores de autenticación y validación de credenciales
2. **SECURITY_THREAT**: Intentos de ataques SQLi, XSS, y otros vectores de seguridad
3. **SYSTEM_ERROR**: Errores del sistema y excepciones no controladas
4. **SUPPORT_EVENT**: Eventos relacionados con soporte técnico
5. **UNAUTHORIZED_ACCESS**: Intentos de acceso no autorizado

### Información Registrada

Cada entrada de log contiene:
- **Timestamp**: Fecha y hora exacta del evento
- **Tipo de error**: Categorización del error
- **Mensaje descriptivo**: Descripción del error ocurrido
- **Información contextual**: IP, User-Agent, usuario, detalles adicionales

## Implementación Técnica

### Arquitectura del Sistema

El sistema está implementado en **Node.js** con las siguientes características:

- **Clase Logger**: Manejo centralizado de todos los logs
- **Integración con Express**: Middleware para captura automática de errores
- **Detección de amenazas**: Análisis de parámetros URL para detectar ataques
- **Logging asíncrono**: Escritura no bloqueante de archivos

### Funcionalidades Principales

#### 1. Logging de Errores de Login
```javascript
logger.logLoginError(username, clientIP, userAgent, errorDetails);
```

#### 2. Detección de Amenazas de Seguridad
```javascript
logger.logSecurityThreat(threatType, suspiciousInput, ip, userAgent, endpoint);
```

#### 3. Registro de Errores del Sistema
```javascript
logger.logSystemError(errorMessage, stackTrace, context);
```

#### 4. Eventos de Soporte Técnico
```javascript
logger.logSupportEvent(eventType, userInfo, details);
```

## Casos de Uso Implementados

### 1. Validación de Login
- Registro de intentos fallidos de autenticación
- Detección de ataques de fuerza bruta
- Logging de errores de validación de entrada

### 2. Eventos de Soporte Técnico
- Registro cuando usuarios hacen clic en "Soporte Técnico"
- Tracking de solicitudes de ayuda
- Monitoreo de interacciones con el sistema de soporte

### 3. Detección de Ataques
- Análisis de parámetros URL sospechosos
- Detección de intentos de SQL Injection
- Identificación de ataques XSS
- Registro de intentos de Path Traversal

## Estructura de Archivos

```
prototipo-aiep/
├── logs/                          # Carpeta de archivos de log
│   ├── Log_Excepciones_20240928.txt  # Archivo de log diario
│   └── README.md                  # Esta documentación
├── logger.js                     # Sistema de logging principal
├── server.js                     # Servidor con integración de logging
└── views/
    └── dashboard.html            # Dashboard con eventos de soporte
```

## Ejemplo de Salida del Log

```
[28/09/2024 21:45:32] [LOGIN_ERROR] Intento de login fallido para usuario: admin | IP: 127.0.0.1, UserAgent: Mozilla/5.0..., Details: Contraseña incorrecta
[28/09/2024 21:46:15] [SECURITY_THREAT] Posible ataque MALICIOUS_PARAMETER detectado | Input: id=1' OR '1'='1, IP: 192.168.1.100, UserAgent: curl/7.68.0, Endpoint: /dashboard
[28/09/2024 21:47:03] [SUPPORT_EVENT] Evento de soporte: SUPPORT_CONTACT | User: doctor1, Details: Usuario solicitó contacto con soporte técnico desde dashboard
[28/09/2024 21:48:21] [SYSTEM_ERROR] Error en endpoint de login | StackTrace: Error: Database connection failed..., Context: Usuario: admin, IP: 127.0.0.1
```

## Beneficios del Sistema

1. **Trazabilidad completa**: Registro detallado de todos los eventos críticos
2. **Detección temprana**: Identificación proactiva de amenazas de seguridad
3. **Análisis forense**: Información detallada para investigación de incidentes
4. **Cumplimiento normativo**: Registro de eventos para auditorías
5. **Monitoreo operacional**: Seguimiento del uso del sistema de soporte

## Consideraciones de Seguridad

- Los logs no contienen información sensible como contraseñas
- Sanitización de datos antes del registro
- Rotación automática de archivos por día
- Protección contra inyección de logs

## Conclusiones

Este prototipo demuestra la implementación exitosa de un sistema de logging robusto que cumple con todos los requerimientos establecidos por AIEP. El sistema proporciona:

- **Registro automático** de errores y excepciones
- **Formato estandarizado** de archivos de log
- **Detección proactiva** de amenazas de seguridad
- **Integración transparente** con la aplicación existente
- **Escalabilidad** para implementación en sistemas de producción

El sistema está listo para ser adaptado e implementado en los sistemas existentes de la Clínica Oftalmológica Mírame, proporcionando una base sólida para el monitoreo, debugging y análisis de seguridad de las aplicaciones.

---

**Desarrollado por**: Equipo de Desarrollo AIEP  
**Fecha**: Septiembre 2024  
**Versión**: 1.0  
**Tecnología**: Node.js, Express.js, JavaScript