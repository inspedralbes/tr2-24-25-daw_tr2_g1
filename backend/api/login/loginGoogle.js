import { OAuth2Client } from 'google-auth-library';
import { pool } from '../../api/db.js';
import 'dotenv/config';

// Asegúrate de que este ID coincide con el del frontend
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '182669171058-e7grkc62veee2a4t7k00dfqb450vo6j3.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const loginGoogle = async (req, res) => {
  const { id_token } = req.body;
  
  if (!id_token) {
    return res.status(400).json({ error: 'Falta el token de Google' });
  }

  try {
    // 1. Verificar el token con Google
    const ticket = await client.verifyIdToken({ 
      idToken: id_token, 
      audience: GOOGLE_CLIENT_ID 
    });
    
    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) {
      return res.status(400).json({ error: 'No se pudo obtener el email del token' });
    }

    console.log("Intentando login con Google para:", email);

    // 2. BUSCAR EN LA BASE DE DATOS (Corregido: email_centre)
    // Usamos 'email_centre' que es como se llama tu columna en la DB
    const query = 'SELECT * FROM centres WHERE email_centre = ? LIMIT 1';
    const [rows] = await pool.query(query, [email]);

    // 3. Si no existe, error 404
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Aquest correu no pertany a cap centre registrat' });
    }

    const centre = rows[0];

    // 4. Login exitoso
    return res.json({ 
      success: true,
      message: "Login correcte",
      centre: {
        id: centre.id,
        nom: centre.denominacio_completa,
        codi: centre.codi_centre,
        email: centre.email_centre,
        // Puedes añadir la foto de google si quieres: picture: payload.picture
      }
    });

  } catch (err) {
    console.error('Error en loginGoogle:', err);
    return res.status(500).json({ error: 'Error verificando la identidad con Google' });
  }
};