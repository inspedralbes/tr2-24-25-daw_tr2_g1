// ============================================
// AUTENTICACIÓN CON GOOGLE OAUTH
// ============================================
// Sistema de login dual: centros educativos y profesores
// Primero busca en la tabla 'centres', luego en 'professors'
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../../api/db.js';
import 'dotenv/config';

// Client ID de Google OAuth - debe coincidir con el del frontend
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '182669171058-e7grkc62veee2a4t7k00dfqb450vo6j3.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

console.log("DEBUG: Google Client ID configurado:", GOOGLE_CLIENT_ID);
console.log("DEBUG: Iniciando loginGoogle...");

export const loginGoogle = async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ error: 'Falta el token de Google' });
  }

  try {
    // ============================================
    // PASO 1: Verificar el token con Google
    // ============================================
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID
    });

    // Extraer información del usuario de Google
    const payload = ticket.getPayload();
    const email = payload?.email;
    const googleName = payload?.name; // Nombre del usuario
    const googlePicture = payload?.picture; // Foto de perfil

    if (!email) {
      return res.status(400).json({ error: 'No se pudo obtener el email del token' });
    }

    console.log("Intentando login con Google para:", email);
    console.log("Nombre de Google:", googleName);

    // ============================================
    // PASO 2: Buscar en tabla CENTRES (centros educativos)
    // ============================================
    const queryCentre = 'SELECT * FROM centres WHERE email_centre = ? LIMIT 1';
    const [rowsCentre] = await pool.query(queryCentre, [email]);

    // Si el email pertenece a un centro educativo
    // Si encontramos el email, devolver los datos del centro
    if (rowsCentre && rowsCentre.length > 0) {
      const centre = rowsCentre[0];
      console.log("✅ Login como CENTRO:", centre.denominacio_completa);

      // Devolver datos del centro para guardar en localStorage del frontend
      return res.json({
        success: true,
        message: "Login correcte com a centre",
        centre: {
          id: centre.id,
          nom: centre.denominacio_completa,
          codi: centre.codi_centre,
          email: centre.email_centre,
        }
      });
    }

    // ============================================
    // PASO 3: Buscar en tabla PROFESSORS (profesores)
    // ============================================
    // Si no es un centro, buscar si es un profesor autorizado
    const queryProf = `
      SELECT p.id, p.nom, p.email, p.centre_id, c.denominacio_completa as centre_nom, c.codi_centre
      FROM professors p 
      INNER JOIN centres c ON p.centre_id = c.id 
      WHERE p.email = ? 
      LIMIT 1
    `;
    const [rowsProf] = await pool.query(queryProf, [email]);

    // Si encontramos el email en profesores, procesar login
    if (rowsProf && rowsProf.length > 0) {
      const profesor = rowsProf[0];
      console.log("✅ Login como PROFESOR del centre:", profesor.centre_nom);

      // AUTO-UPDATE: Primera vez que inicia sesión, actualizar nombre desde Google
      // Esto evita tener que pedirle al profesor que complete un registro manual
      if (profesor.nom === "Pendent de registre" && googleName) {
        console.log("Actualizando nombre del profesor a:", googleName);
        // Actualizar en BD
        await pool.query(
          "UPDATE professors SET nom = ? WHERE id = ?",
          [googleName, profesor.id]
        );
        // Actualizar en memoria para la respuesta
        profesor.nom = googleName;
      }

      return res.json({
        success: true,
        message: "Login correcte com a professor",
        centre: {
          id: profesor.centre_id,           // IMPORTANTE: Devolvemos el ID del centro del profesor
          nom: profesor.centre_nom,         // Nombre del centro al que pertenece
          codi: profesor.codi_centre,       // Código del centro
          email: profesor.email,            // Email del profesor
          esProfesor: true,                 // Flag para saber que es profesor, no centro
          profesorNom: profesor.nom,        // Nombre del profesor (ya actualizado si era necesario)
          picture: googlePicture            // Foto de perfil de Google
        }
      });
    }

    // ============================================
    // PASO 4: Usuario no autorizado (404)
    // ============================================
    // Si llegamos aquí, el email de Google no está ni en centres ni en professors
    // El usuario debe contactar con su centro para que le den de alta
    return res.status(404).json({
      error: 'Aquest correu no està autoritzat. Contacta amb el teu centre per obtenir accés.'
    });

  } catch (err) {
    console.error('ERROR CRÍTICO en loginGoogle:', err);
    console.error('Detalles del error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return res.status(500).json({
      error: 'Error verificando la identidad con Google',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Consulte los logs del servidor'
    });
  }
};