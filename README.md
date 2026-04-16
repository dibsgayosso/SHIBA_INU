# SHIBA_INU

Landing page de venta de cachorros Shiba Inu con panel administrador visual, login y configuración de SEO/WhatsApp.

## Archivos
- `index.html`: redirección directa a la landing principal (sin barra de cabecera adicional).
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
4. Abre `http://localhost:3000` para entrar directo a la landing.
5. Haz clic en **Admin Login** para editar.
6. En el panel puedes cambiar textos/colores y también subir imágenes desde tu computadora o por URL.

### Credenciales por defecto
- Usuario: `admin`
- Contraseña: `admin123`

> Recomendación: cambia el usuario/contraseña en la base de datos para producción.

## Si no tienes Node.js
- El login puede funcionar en **modo local de contingencia** con `admin / admin123` para desbloquear el panel en el navegador.
- En ese modo no se usa API ni base de datos; la edición se guarda en `localStorage`.


## Personalizaciones incluidas
- Se eliminó la barra de preview para entrar directo a la landing.
- Se agregó sección de **Shiba Inu Campeón Mexicano**.
- Se agregó sección de entregas en México con mapa y estados interactivos (excepto Baja California Sur, Tamaulipas, Tlaxcala y Nayarit).
