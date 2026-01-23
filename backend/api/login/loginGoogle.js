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
    const googleName = payload?.name; // OBTENER NOMBRE DE GOOGLE
    const googlePicture = payload?.picture; // OBTENER FOTO DE PERFIL

    if (!email) {
      return res.status(400).json({ error: 'No se pudo obtener el email del token' });
    }

    console.log("Intentando login con Google para:", email);
    console.log("Nombre de Google:", googleName);

    // 2. BUSCAR PRIMERO EN LA TABLA CENTRES (para centros educativos)
    const queryCentre = 'SELECT * FROM centres WHERE email_centre = ? LIMIT 1';
    const [rowsCentre] = await pool.query(queryCentre, [email]);

    // Si encontramos el email en CENTRES, login como centro
    if (rowsCentre && rowsCentre.length > 0) {
      const centre = rowsCentre[0];
      console.log("✅ Login como CENTRO:", centre.denominacio_completa);
      
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

    // 3. SI NO ESTÁ EN CENTRES, BUSCAR EN LA TABLA PROFESSORS (para profesores autorizados)
    const queryProf = `
      SELECT p.id, p.nom, p.email, p.centre_id, c.denominacio_completa as centre_nom, c.codi_centre
      FROM professors p 
      INNER JOIN centres c ON p.centre_id = c.id 
      WHERE p.email = ? 
      LIMIT 1
    `;
    const [rowsProf] = await pool.query(queryProf, [email]);

    // Si encontramos el email en PROFESSORS, login como profesor
    if (rowsProf && rowsProf.length > 0) {
      const profesor = rowsProf[0];
      console.log("✅ Login como PROFESOR del centre:", profesor.centre_nom);
      
      // ACTUALIZAR NOMBRE SI TODAVÍA ES "Pendent de registre"
      if (profesor.nom === "Pendent de registre" && googleName) {
        console.log("Actualizando nombre del profesor a:", googleName);
        await pool.query(
          "UPDATE professors SET nom = ? WHERE id = ?",
          [googleName, profesor.id]
        );
        // Actualizar el objeto para devolverlo con el nombre correcto
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

    // 4. Si no existe ni en centres ni en professors, error 404
    return res.status(404).json({ 
      error: 'Aquest correu no està autoritzat. Contacta amb el teu centre per obtenir accés.' 
    });

  } catch (err) {
    console.error('Error en loginGoogle:', err);
    return res.status(500).json({ error: 'Error verificando la identidad con Google' });
  }
};