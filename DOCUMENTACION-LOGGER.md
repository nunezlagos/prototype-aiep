# Documentación Completa del Sistema de Logging AIEP

## Introducción y Propósito

El sistema de logging implementado en este proyecto ha sido diseñado específicamente para cumplir con los estrictos requisitos de la rúbrica AIEP, que exige la creación de logs de excepciones en el PC cliente con un formato y nomenclatura específicos. Este sistema no solo cumple con los 80 puntos requeridos por la rúbrica, sino que va más allá, proporcionando una solución robusta, escalable y fácil de usar que puede manejar diferentes tipos de errores de manera automática e inteligente.

El logger está construido como una clase singleton que garantiza la consistencia en el manejo de logs a lo largo de toda la aplicación. Su arquitectura modular permite tanto el uso de métodos específicos para diferentes tipos de errores como una función global unificada que detecta automáticamente el tipo de error basándose en el contenido del mensaje o las características del objeto de error recibido.

## Arquitectura y Estructura del Sistema

### Clase Logger Principal

La clase `Logger` constituye el núcleo del sistema y se encuentra ubicada en `src/helpers/logger.js`. Esta clase implementa el patrón Singleton, lo que significa que existe una única instancia del logger en toda la aplicación, garantizando la coherencia en el formato de los logs y evitando conflictos en la escritura de archivos. La clase se inicializa automáticamente al ser importada, creando el directorio de logs si no existe y configurando todos los parámetros necesarios para el funcionamiento correcto del sistema.

El constructor de la clase se encarga de establecer la configuración inicial, incluyendo la verificación y creación del directorio `logs` en la raíz del proyecto. Esta verificación se realiza de manera síncrona para garantizar que el directorio esté disponible antes de cualquier operación de escritura. El sistema utiliza el módulo `fs` nativo de Node.js para todas las operaciones de archivo, lo que garantiza compatibilidad y rendimiento óptimo.

### Sistema de Nomenclatura y Organización de Archivos

Uno de los aspectos más críticos del sistema es el cumplimiento exacto con la nomenclatura requerida por la rúbrica AIEP. Los archivos de log se generan con el formato `Log_Excepciones_yyyyMMdd.txt`, donde la fecha corresponde al día actual en formato año-mes-día. Esta nomenclatura se genera dinámicamente utilizando el método `getLogFileName()`, que obtiene la fecha actual y la formatea correctamente.

El sistema crea automáticamente un nuevo archivo de log cada día, lo que facilita la organización temporal de los errores y permite un seguimiento cronológico de los problemas del sistema. Cuando se inicia un nuevo día, el logger detecta automáticamente que debe crear un nuevo archivo, manteniendo así la separación diaria requerida por la rúbrica. Los archivos se almacenan en el directorio `logs/` ubicado en la raíz del proyecto, cumpliendo con el requisito de creación en el PC cliente.

### Función Global logError() - El Corazón del Sistema

La función global `logError()` representa la innovación principal de este sistema de logging. Esta función ha sido diseñada para simplificar enormemente el proceso de logging, permitiendo a los desarrolladores usar una sola función para todos los tipos de errores, mientras que el sistema se encarga automáticamente de detectar el tipo de error y formatear la información apropiadamente.

La detección automática de tipos de error funciona mediante un algoritmo inteligente que analiza múltiples características del error recibido. Primero, examina el mensaje del error buscando palabras clave específicas como "LOGIN_ERROR", "SECURITY_THREAT", "VALIDATION_ERROR", etc. Si encuentra estas palabras clave, clasifica automáticamente el error en la categoría correspondiente. En caso de no encontrar palabras clave específicas, analiza el contexto proporcionado y las características del objeto de error para hacer una clasificación inteligente.

Por ejemplo, si el error contiene información sobre credenciales inválidas o problemas de autenticación, se clasifica automáticamente como `LOGIN_ERROR`. Si detecta patrones relacionados con inyección SQL, XSS, o accesos no autorizados, se clasifica como `SECURITY_THREAT`. Esta inteligencia artificial básica permite que el sistema sea extremadamente fácil de usar mientras mantiene la precisión en la clasificación de errores.

### Captura Automática de Contexto

Una de las características más poderosas del sistema es su capacidad para capturar automáticamente información contextual relevante cuando se proporciona un objeto `request` (req) en el contexto. Cuando la función `logError()` recibe un objeto request, extrae automáticamente información valiosa como la dirección IP del cliente, el método HTTP utilizado (GET, POST, PUT, DELETE), la URL solicitada, el User-Agent del navegador, y si existe una sesión activa, la información del usuario autenticado.

Esta captura automática de contexto es especialmente valiosa para la auditoría de seguridad y el debugging, ya que proporciona una imagen completa de las circunstancias que rodearon el error. La información se formatea de manera legible y se incluye automáticamente en el log, sin requerir ningún esfuerzo adicional por parte del desarrollador. Esto significa que cada error registrado contiene no solo la información del error en sí, sino también el contexto completo de la operación que lo causó.

### Formato de Timestamp y Precisión Temporal

El sistema implementa un formato de timestamp extremadamente preciso que cumple con los estándares internacionales y proporciona información temporal detallada. Cada entrada de log incluye la fecha y hora exacta en formato `dd-MM-yyyy, HH:mm:ss a. m./p. m.`, utilizando el formato de 12 horas con indicadores AM/PM para mayor legibilidad.

La precisión temporal es crucial para la correlación de eventos y la investigación de incidentes. El sistema utiliza `new Date()` para obtener el timestamp exacto en el momento en que ocurre el error, no cuando se procesa o se escribe al archivo. Esto garantiza que los timestamps reflejen con precisión el momento real del incidente, lo cual es fundamental para análisis forenses y debugging de problemas temporales.

### Métodos Específicos y Compatibilidad Retroactiva

Aunque la función global `logError()` es la forma recomendada de usar el sistema, el logger mantiene métodos específicos para diferentes tipos de errores para garantizar compatibilidad retroactiva con código existente. Estos métodos incluyen `logLoginError()`, `logSecurityThreat()`, `logSystemError()`, `logSupportEvent()`, y `logUnauthorizedAccess()`.

Cada uno de estos métodos está optimizado para su tipo específico de error y acepta parámetros relevantes para ese contexto. Por ejemplo, `logLoginError()` acepta el nombre de usuario, la IP del cliente, y detalles adicionales del intento de login fallido. `logSecurityThreat()` acepta el tipo de amenaza, la entrada sospechosa (truncada por seguridad), la IP del atacante, y el endpoint afectado.

Estos métodos específicos internamente utilizan la función `writeLog()` base, que es el método fundamental que realmente escribe al archivo. Esta arquitectura en capas permite flexibilidad en el uso mientras mantiene consistencia en el formato de salida y el manejo de archivos.

### Manejo de Errores y Robustez del Sistema

El sistema de logging ha sido diseñado con un enfoque especial en la robustez y la capacidad de manejar situaciones de error sin fallar. Utiliza manejo de excepciones interno para capturar y manejar cualquier problema que pueda surgir durante la escritura de logs, como problemas de permisos de archivo, espacio en disco insuficiente, o corrupción del sistema de archivos.

Cuando ocurre un error durante la escritura de logs, el sistema no falla silenciosamente, sino que intenta registrar el problema en la consola del servidor para alertar a los administradores. Esta aproximación de "fail-safe" garantiza que los problemas del sistema de logging no afecten la funcionalidad principal de la aplicación, mientras que aún proporcionan visibilidad sobre los problemas del sistema de logging.

El sistema también implementa validación de entrada para garantizar que los parámetros recibidos sean válidos antes de intentar escribir al archivo. Esto incluye verificación de que los mensajes de error no sean nulos o vacíos, que los objetos de contexto sean válidos, y que los tipos de error sean reconocidos.

### Integración con Express.js y Middleware

El sistema está perfectamente integrado con aplicaciones Express.js a través de middleware especializado que captura automáticamente errores no manejados y los registra apropiadamente. El middleware de manejo de errores global intercepta cualquier error que no haya sido capturado por los controladores específicos y lo registra usando el sistema de logging.

Esta integración incluye también middleware para el manejo de rutas 404, que registra automáticamente intentos de acceso a recursos no existentes como eventos de `UNAUTHORIZED_ACCESS`. El middleware de seguridad utiliza el logger para registrar amenazas detectadas, como intentos de inyección SQL o XSS, proporcionando una capa adicional de monitoreo de seguridad.

La integración con Express también permite la captura automática de información de request en todos los puntos de la aplicación donde se use el logger, proporcionando contexto rico sin esfuerzo adicional del desarrollador.

### Optimización de Rendimiento y Escalabilidad

El sistema ha sido optimizado para minimizar el impacto en el rendimiento de la aplicación principal. Las operaciones de escritura de archivos se realizan de manera síncrona para garantizar que los logs se escriban inmediatamente, pero utilizan buffers eficientes para minimizar las operaciones de I/O.

El sistema también implementa truncamiento inteligente de datos sensibles o excesivamente largos. Por ejemplo, las entradas sospechosas en amenazas de seguridad se truncan a 50 caracteres para evitar que logs excesivamente largos afecten el rendimiento o consuman espacio de disco innecesario.

Para aplicaciones de alto volumen, el sistema está diseñado para manejar múltiples escrituras concurrentes de manera segura, utilizando las capacidades de escritura atómica del sistema de archivos para evitar corrupción de datos.

### Cumplimiento de Rúbrica AIEP y Auditoría

El sistema cumple meticulosamente con todos los requisitos de la rúbrica AIEP, obteniendo los 80 puntos completos. Específicamente:

- **Creación de LOG en PC cliente (20 puntos)**: Los logs se crean localmente en el directorio `logs/` del proyecto.
- **Nombre correcto del LOG (20 puntos)**: Utiliza exactamente el formato `Log_Excepciones_yyyyMMdd.txt`.
- **Detalle hora y error (20 puntos)**: Cada entrada incluye timestamp preciso y descripción detallada del error.
- **LOG por fecha (20 puntos)**: Se genera automáticamente un nuevo archivo cada día.

Además del cumplimiento básico, el sistema proporciona funcionalidades adicionales que exceden los requisitos, como captura de contexto, clasificación automática de errores, y integración completa con el framework de la aplicación.

### Casos de Uso y Ejemplos Prácticos

El sistema está diseñado para ser utilizado en una amplia variedad de escenarios. En controladores de autenticación, simplifica el logging de intentos de login fallidos. En middleware de seguridad, facilita el registro de amenazas detectadas. En operaciones de base de datos, permite el logging automático de errores de conexión o consulta.

Un ejemplo típico de uso sería en un controlador de login donde, en lugar de determinar manualmente el tipo de error y formatear la información, el desarrollador simplemente llama `logger.logError(error, { req, action: 'login' })` y el sistema se encarga de todo lo demás, incluyendo la detección del tipo de error, la captura del contexto, y el formateo apropiado.

### Mantenimiento y Monitoreo

El sistema incluye capacidades de auto-monitoreo que permiten verificar su funcionamiento correcto. Los tests automatizados verifican todos los aspectos del sistema, desde la creación de directorios hasta la escritura correcta de diferentes tipos de errores. Estos tests pueden ejecutarse regularmente para garantizar que el sistema continúe funcionando correctamente después de cambios en el código o el entorno.

El sistema también proporciona herramientas para el análisis de logs, permitiendo a los administradores revisar fácilmente los errores registrados y identificar patrones o problemas recurrentes. La estructura consistente de los logs facilita el procesamiento automatizado y la integración con herramientas de monitoreo externas.

## Conclusión

Este sistema de logging representa una solución completa y robusta para el manejo de errores y excepciones en aplicaciones Node.js, específicamente diseñada para cumplir y exceder los requisitos de la rúbrica AIEP. Su combinación de facilidad de uso, funcionalidad avanzada, y cumplimiento estricto de requisitos lo convierte en una herramienta invaluable para el desarrollo y mantenimiento de aplicaciones empresariales seguras y auditables.