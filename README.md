# SHIBA_INU

Landing page de venta de cachorros Shiba Inu con panel administrador visual, login y configuración de SEO/WhatsApp.

## Archivos
- `index.html`: contenedor de vista previa fullscreen (estilo marketplace) con iframe.
- `landing.html`: landing real editable con login de administrador.
- `styles.css`: estilos del sitio, panel, modal y botón flotante de WhatsApp.
- `preview.css`: estilos de la barra superior y preview fullscreen.
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
4. Abre `http://localhost:3000` para ver el preview.
5. Dentro del iframe (landing), haz clic en **Admin Login** para editar.
6. En el panel puedes cambiar textos/colores y también subir imágenes desde tu computadora o por URL.

### Credenciales por defecto
- Usuario: `admin`
- Contraseña: `admin123`

> Recomendación: cambia el usuario/contraseña en la base de datos para producción.
