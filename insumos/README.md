# Prototipo Login - Clínica Oftalmológica

Sistema de autenticación para administración de clínica oftalmológica, inspirado en el diseño de ClaveÚnica.

## 🏥 Características

- **Diseño Profesional**: Interfaz inspirada en ClaveÚnica con temática médica
- **Autenticación Segura**: Sistema de login con validación de RUT chileno
- **Responsive Design**: Adaptable a dispositivos móviles y desktop
- **Modo Oscuro**: Toggle entre tema claro y oscuro
- **Accesibilidad**: Controles de tamaño de fuente y navegación por teclado
- **Sesiones Seguras**: Manejo de sesiones con Express Session

## 🚀 Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd prototipo-aiep
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor**
   ```bash
   npm start
   ```
   
   O para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 👥 Credenciales de Prueba

### Administrador
- **RUT**: 12.345.678-9
- **Contraseña**: admin123
- **Rol**: Administrador

### Doctor
- **RUT**: 98.765.432-1
- **Contraseña**: doctor456
- **Rol**: Oftalmólogo

## 📁 Estructura del Proyecto

```
prototipo-aiep/
├── server.js              # Servidor Express principal
├── package.json           # Dependencias y scripts
├── README.md             # Documentación
└── public/               # Archivos estáticos
    ├── index.html        # Página de login
    ├── styles.css        # Estilos CSS
    └── script.js         # JavaScript del cliente
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Autenticación**: bcryptjs, express-session
- **Iconos**: Font Awesome
- **Validación**: RUT chileno con dígito verificador

## 🔧 Funcionalidades

### Página de Login
- Validación de RUT chileno en tiempo real
- Formateo automático de RUT (puntos y guión)
- Toggle de visibilidad de contraseña
- Validación de formulario
- Mensajes de error y éxito
- Animaciones de carga

### Dashboard
- Panel de administración básico
- Estadísticas de la clínica
- Información del usuario logueado
- Opción de cerrar sesión

### Características de Accesibilidad
- Navegación por teclado
- Contraste adecuado
- Tamaño de fuente ajustable
- Modo oscuro/claro
- Etiquetas semánticas

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Validación de entrada en servidor y cliente
- Sesiones seguras con expiración
- Protección de rutas autenticadas
- Validación de RUT con algoritmo oficial

## 📱 Responsive Design

El diseño se adapta a diferentes tamaños de pantalla:
- **Desktop**: Diseño completo con todas las características
- **Tablet**: Adaptación de espaciados y tamaños
- **Mobile**: Interfaz optimizada para pantallas pequeñas

## 🎨 Personalización

### Colores del Tema
Los colores principales se pueden modificar en el archivo `styles.css`:

```css
:root {
    --primary-color: #1e3a8a;    /* Azul principal */
    --secondary-color: #3b82f6;  /* Azul secundario */
    --accent-color: #ef4444;     /* Rojo de acento */
    --success-color: #10b981;    /* Verde de éxito */
}
```

### Agregar Nuevos Usuarios
En el archivo `server.js`, modificar el array `users`:

```javascript
const users = [
    {
        rut: 'XX.XXX.XXX-X',
        password: bcrypt.hashSync('contraseña', 10),
        name: 'Nombre Completo',
        role: 'Rol',
        email: 'email@clinica.cl'
    }
];
```

## 🚀 Despliegue en Producción

Para desplegar en producción:

1. **Variables de Entorno**
   ```bash
   export PORT=3000
   export NODE_ENV=production
   ```

2. **Configurar HTTPS**
   - Modificar `cookie.secure` a `true` en `server.js`
   - Configurar certificados SSL

3. **Base de Datos**
   - Reemplazar el array de usuarios por una base de datos real
   - Implementar MongoDB, PostgreSQL, etc.

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@clinicavision.cl
- Teléfono: +56 2 XXXX XXXX

---

**Desarrollado para Clínica Oftalmológica** 👁️