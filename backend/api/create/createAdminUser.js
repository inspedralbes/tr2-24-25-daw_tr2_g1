import { pool } from "../db.js"; 

export async function createAdminUser(req, res) {
  const { email, centre_id } = req.body;

  // Validación
  if (!email || !centre_id) {
    return res.status(400).json({ error: "Falten dades (email o centre)" });
  }

  // --- EL PARCHE SILENCIOSO ---
  // Datos falsos para cumplir con los requisitos NOT NULL de tu base de datos
  const nomFalso = "Pendent de registre";
  const passwordFalso = "GOOGLE_AUTH_PLACEHOLDER";

  try {
    const query = `
      INSERT INTO professors (email, centre_id, nom, password) 
      VALUES (?, ?, ?, ?)
    `;
    
    // Ejecutamos la query pasando los datos reales + los inventados
    await pool.query(query, [email, centre_id, nomFalso, passwordFalso]);

    res.json({ success: true, message: "Professor autoritzat correctament" });

  } catch (error) {
    console.error("Error createAdminUser:", error);
    
    // Código 1062 = Entrada duplicada (Email repetido)
    if (error.errno === 1062) {
      return res.status(400).json({ error: "Aquest correu ja està registrat." });
    }
    
    res.status(500).json({ error: "Error del servidor al crear usuari" });
  }
}