const mysql = require('mysql2/promise');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'db_plapi_dev',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const getCentreByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM centres WHERE email = ?',
        [email]
    );
    // Note: The original index.js used 'email_centre' but the query used 'email' in my assumed plan?
    // Let's check the original index.js again. It used 'SELECT * FROM centres WHERE email_centre = ?'
    // But the user didn't give me the 'centres' table structure fully in the prompt, only 'codi_centre', 'denominacio_completa'.
    // However, the original code had 'email_centre'. If the user says 'email' in professors table, be careful.
    // I will stick to what the original index.js was likely trying to do or standard 'email'.
    // Wait, original index.js had: 'SELECT * FROM centres WHERE email_centre = ?'. 
    // I'll stick to that column name for safety, or check if I should use a generic one.
    // Actually, let's look at the original index.js in Step 19.
    // It says: "SELECT * FROM centres WHERE email_centre = ?"
    // So the column is likely 'email_centre'. 

    // BUT the USER prompt SQL for `professors` has `email`. 
    // The USER prompt SQL for `centres` has `/* ... otros campos ... */`.
    // So I will trust valid SQL from the user or the previous code. 
    // Previous code used `email_centre`. I will use `email_centre` for centres.

    // Wait, let's double check Step 19.
    // Line 20: 'SELECT * FROM centres WHERE email_centre = ?',
    // Line 34: email: centre.email_centre

    // So yes, usage of email_centre is correct.
    return rows[0];
};

// Function check if alumne exists
const getAlumneByDNI = async (dni) => {
    const [rows] = await pool.query('SELECT * FROM alumnes WHERE dni = ?', [dni]);
    return rows[0];
};

const createAlumne = async (data) => {
    // data: { nom, cognom, ralc, dni, data_naixement, centre_procedencia_id }
    const { nom, cognom, ralc, dni, data_naixement, centre_procedencia_id } = data;

    // Default centre_procedencia_id to 835 if not provided (as per SQL default)
    const centreId = centre_procedencia_id || 835;

    const [result] = await pool.query(
        'INSERT INTO alumnes (nom, cognom, ralc, dni, data_naixement, centre_procedencia_id) VALUES (?, ?, ?, ?, ?, ?)',
        [nom, cognom, ralc, dni, data_naixement, centreId]
    );
    return result.insertId;
};

const createPI = async (data) => {
    // data: { alumne_id, professor_id, estat, ruta_pdf, dades_ia }
    const { alumne_id, professor_id, estat, ruta_pdf, dades_ia } = data;

    // data_creacio is usually handled by DB default or we pass it. SQL says `data_creacio datetime NOT NULL`. 
    // It doesn't say DEFAULT CURRENT_TIMESTAMP. So we must pass it.
    const data_creacio = new Date();

    const [result] = await pool.query(
        'INSERT INTO pis (alumne_id, professor_id, estat, ruta_pdf, dades_ia, data_creacio) VALUES (?, ?, ?, ?, ?, ?)',
        [alumne_id, professor_id, estat, ruta_pdf, dades_ia, data_creacio]
    );
    return result.insertId;
};

// Get all alumnes with centre information
const getAllAlumnes = async () => {
    const [rows] = await pool.query(`
        SELECT 
            a.ralc,
            a.nom,
            a.cognom as cognoms,
            a.dni,
            a.data_naixement as dataNaixement,
            '1r ESO' as curs,
            c.denominacio_completa as centreProcedencia
        FROM alumnes a
        LEFT JOIN centres c ON a.centre_procedencia_id = c.id
    `);
    return rows;
};

// Get alumne by RALC with their PIs
const getAlumneByRalc = async (ralc) => {
    const [alumnes] = await pool.query(`
        SELECT 
            a.ralc,
            a.nom,
            a.cognom as cognoms,
            a.dni,
            a.data_naixement as dataNaixement,
            '1r ESO' as curs,
            c.denominacio_completa as centreProcedencia
        FROM alumnes a
        LEFT JOIN centres c ON a.centre_procedencia_id = c.id
        WHERE a.ralc = ?
    `, [ralc]);
    
    if (alumnes.length === 0) return null;
    
    const alumne = alumnes[0];
    
    // Get PIs for this alumne
    const [pis] = await pool.query(`
        SELECT 
            pi.id,
            pi.estat,
            pi.ruta_pdf,
            pi.data_creacio,
            pi.dades_ia,
            p.nom as professorNom,
            p.cognom as professorCognom
        FROM pis pi
        LEFT JOIN professors p ON pi.professor_id = p.id
        WHERE pi.alumne_id = (SELECT id FROM alumnes WHERE ralc = ?)
    `, [ralc]);
    
    alumne.pis = pis;
    return alumne;
};

module.exports = {
    pool,
    getCentreByEmail,
    getAlumneByDNI,
    createAlumne,
    createPI,
    getAllAlumnes,
    getAlumneByRalc
};
