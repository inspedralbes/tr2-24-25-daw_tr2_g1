import { pool } from "../db.js";

// Obtener profesores
export async function getUsersByCentreId(req, res) {
  const centerId = req.params.id; 

  try {
    // Consultar BD
    const query = `
      SELECT id, email, nom 
      FROM professors 
      WHERE centre_id = ? 
      ORDER BY id DESC
    `;
    const [rows] = await pool.query(query, [centerId]);
    
    res.json({ success: true, data: rows });

  } catch (error) {
    // Error servidor
    console.error(error);
    res.status(500).json({ error: "Error carregant professors del centre" });
  }
}

// Eliminar usuario
export async function deleteUser(req, res) {
  try {
    // Borrar registro
    await pool.query("DELETE FROM professors WHERE id = ?", [req.params.id]);
    res.json({ success: true });

  } catch (error) {
    // Error servidor
    console.error(error);
    res.status(500).json({ error: "Error eliminant usuari" });
  }
}

// Listar centros
export async function getAllCentres(req, res) {
    try {
        // Obtener nombres
        const [rows] = await pool.query("SELECT id, denominacio_completa as nom FROM centres");
        res.json({ success: true, data: rows });

    } catch (e) { 
        // Error servidor
        res.status(500).json({ error: e.message }); 
    }
}