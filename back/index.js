const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user_dev',
  password: process.env.DB_PASSWORD || 'password_dev',
  database: process.env.DB_DATABASE || 'db_plapi_dev'
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente con Docker!');
});

// Endpoint para obtener todos los alumnos
app.get('/api/alumnes', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.ralc,
        a.nom,
        a.cognom as cognoms,
        a.dni,
        a.data_naixement as dataNaixement,
        c.denominacio_completa as centre
      FROM alumnes a
      LEFT JOIN centres c ON a.centre_procedencia_id = c.id
      ORDER BY a.cognom, a.nom
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error obteniendo alumnos:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
});

// Endpoint para obtener un alumno por RALC
app.get('/api/alumnes/:ralc', async (req, res) => {
  try {
    const { ralc } = req.params;
    
    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.ralc,
        a.nom,
        a.cognom as cognoms,
        a.dni,
        a.data_naixement as dataNaixement,
        c.denominacio_completa as centre,
        c.email_centre as centreEmail
      FROM alumnes a
      LEFT JOIN centres c ON a.centre_procedencia_id = c.id
      WHERE a.ralc = ?
    `, [ralc]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Alumne no trobat' });
    }
    
    // Obtener PIs del alumno
    const [pis] = await pool.query(`
      SELECT 
        p.id,
        p.estat,
        p.ruta_pdf,
        p.dades_ia,
        p.data_creacio as dataCreacio,
        prof.nom as professorNom
      FROM pis p
      LEFT JOIN professors prof ON p.professor_id = prof.id
      WHERE p.alumne_id = ?
      ORDER BY p.data_creacio DESC
    `, [rows[0].id]);
    
    res.json({ 
      success: true, 
      data: {
        ...rows[0],
        pis: pis
      }
    });
  } catch (error) {
    console.error('Error obteniendo alumno:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
});

app.post('/api/login-centre', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Falta el correu electrònic' });
    }

    try {
        // Buscamos si existe un centro con ese email
        // ATENCIÓN: Asegúrate de que 'db' es tu conexión a MySQL
        const [rows] = await db.query(
            'SELECT * FROM centres WHERE email_centre = ?', 
            [email]
        );

        if (rows.length > 0) {
            // ¡ENCONTRADO! 
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
            // NO ENCONTRADO
            res.status(404).json({ error: 'Aquest correu no pertany a cap centre registrat' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
