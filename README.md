# SHIBA_INU

Landing page de venta de cachorros Shiba Inu con panel administrador visual, login y configuración de SEO/WhatsApp.

## Archivos
- `index.html`: landing + modal de login + panel administrador.
- `styles.css`: estilos del sitio, panel, modal y botón flotante de WhatsApp.
- `script.js`: lógica de edición visual, persistencia local y autenticación del panel.
- `server.js`: API de login/logout/sesión y servidor estático.
- `db/init.sql`: esquema SQLite de usuarios administradores.

## Base de datos y login de administrador
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Inicializa la base de datos SQLite:
   ```bash
   npm run init-db
   ```
3. Inicia el servidor:
   ```bash
   npm start
   ```
4. Abre `http://localhost:3000`.
5. Haz clic en **Admin Login** para abrir el panel.

### Credenciales por defecto
- Usuario: `admin`
- Contraseña: `admin123`

> Recomendación: cambia el usuario/contraseña en la base de datos para producción.
