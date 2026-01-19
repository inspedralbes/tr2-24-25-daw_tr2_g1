const express = require('express');
const mysql = require('mysql2/promise'); // Librería para conectar a la BD
const cors = require('cors'); // Librería para permitir conectar desde el puerto 3001
const app = express();
const port = 3000;

// 1. Permitir que tu Front (puerto 3001) hable con el Back (3000)
app.use(cors());

// 2. Permitir leer JSON (necesario para leer req.body.email)
app.use(express.json());

// 3. Configurar la conexión a la Base de Datos (Docker / local)
const dbHost = process.env.DB_HOST || process.env.MYSQL_HOST || 'mysql';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : (process.env.MYSQL_TCP_PORT ? parseInt(process.env.MYSQL_TCP_PORT) : 3306);
const dbUser = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || 'root_password';
const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'db_plapi_dev';

console.log(`Conectando a BD en ${dbHost}:${dbPort} como ${dbUser} a la BD ${dbName}`);

const db = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    port: dbPort,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper para probar la conexión y dar mensajes útiles
const testDbConnection = async () => {
    try {
        const conn = await db.getConnection();
        try { await conn.ping(); } finally { conn.release(); }
        console.log('Conexión a la base de datos OK');
        return true;
    } catch (err) {
        console.error('No se pudo conectar a la base de datos. Código:', err.code, 'Mensaje:', err.message);
        if (err.code === 'ECONNREFUSED') {
            console.error('- ECONNREFUSED: no hay servicio MySQL escuchando en esa dirección/puerto.');
            console.error("- Si ejecutas el backend fuera de Docker, debes exponer MySQL en localhost:3306 o cambiar DB_HOST a 'host.docker.internal' (en Windows/Mac)");
            console.error("- Si ejecutas todo con Docker Compose, asegúrate de arrancar el backend dentro del contenedor (docker compose up) para que DB_HOST='mysql' resuelva correctamente");
        }
        return false;
    }
};

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente con Docker!');
});

app.post('/api/login-centre', async (req, res) => {
    const { email } = req.body;
    console.log("Intento de login con:", email); // Log para ver si llega la petición

    if (!email) {
        return res.status(400).json({ error: 'Falta el correu electrònic' });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM centres WHERE email_centre = ?', 
            [email]
        );

        if (rows.length > 0) {
            const centre = rows[0];
            res.json({ 
                success: true, 
                message: 'Login correcte', 
                centre: {
                    id: centre.id,
                    nom: centre.denominacio_completa,
                    codi: centre.codi_centre,
                    email: centre.email_centre
                }
            });
        } else {
            res.status(404).json({ error: 'Aquest correu no pertany a cap centre registrat' });
        }

    } catch (error) {
        console.error("Error en base de datos:", error); // Verás el error exacto en la terminal
        // Enviar código de error para ayudar al diagnóstico desde el front
        res.status(500).json({ error: 'Error del servidor: ' + error.message, code: error.code || null });
    }
});

// Arrancamos el servidor y previamente probamos la conexión a la BD
(async () => {
    const ok = await testDbConnection();
    app.listen(port, () => {
      console.log(`Servidor backend escuchando en el puerto ${port}`);
      if (!ok) console.warn('ATENCIÓN: No se pudo verificar la conexión a la BD al iniciar. Revisa las variables de entorno y la disponibilidad de MySQL.');
    });
})();