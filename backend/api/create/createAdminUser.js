import { pool } from "../db.js"; 

// Registrar nuevo profesor
export async function createAdminUser(req, res) {
  const { email, centre_id } = req.body;

  // Validar datos requeridos
  if (!email || !centre_id) {
    return res.status(400).json({ error: "Falten dades (email o centre)" });
  }

  // Datos provisionales
  const nomFalso = "Pendent de registre";
  const passwordFalso = "GOOGLE_AUTH_PLACEHOLDER";

  try {
    const query = `
      INSERT INTO professors (email, centre_id, nom, password) 
      VALUES (?, ?, ?, ?)
    `;
    
    await pool.query(query, [email, centre_id, nomFalso, passwordFalso]);

    res.json({ success: true, message: "Professor autoritzat correctament" });

  } catch (error) {
    console.error("Error createAdminUser:", error);
    
    // Error: correo duplicado
    if (error.errno === 1062) {
      return res.status(400).json({ error: "Aquest correu ja està registrat." });
    }
    
    res.status(500).json({ error: "Error del servidor al crear usuari" });
  }
}