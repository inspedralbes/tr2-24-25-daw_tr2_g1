const express = require('express');
const cors = require('cors');
// 1. IMPORTANTE: Importamos la librería para conectar con BBDD
const mysql = require('mysql2/promise'); 

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());

// 2. CONFIGURACIÓN DE LA CONEXIÓN (Esto es lo que te faltaba)
// Creamos un "pool" (grupo de conexiones) para que sea más eficiente
const db = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',       // Nombre del servicio en Docker
    user: process.env.DB_USER || 'user_dev',    // Usuario definido en docker-compose
    password: process.env.DB_PASSWORD || 'password_dev', // Contraseña definida en docker-compose
    database: 'db_plapi_dev',                   // Nombre exacto de tu BBDD
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente con Docker!');
});

app.post('/api/login-centre', async (req, res) => {
    const { email } = req.body;
    console.log("Intento de login con email:", email); // Verás esto en la terminal

    if (!email) {
        return res.status(400).json({ error: 'Falta el correu electrònic' });
    }

    try {
        // Ahora 'db' YA EXISTE, así que esto funcionará
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
                    nom: centre.denominacio_completa, // Asegúrate que este campo existe en tu SQL
                    codi: centre.codi_centre,
                    email: centre.email_centre
                }
            });
        } else {
            res.status(404).json({ error: 'Aquest correu no pertany a cap centre registrat' });
        }

    } catch (error) {
        console.error("ERROR EN BASE DE DATOS:", error); // Esto te dirá el error exacto si falla
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});