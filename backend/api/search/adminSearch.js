import { pool } from "../db.js";

// 1. Obtener profesores de un centro ESPECÍFICO
export async function getUsersByCentreId(req, res) {
  const centerId = req.params.id; // Recibimos el ID por la URL

  try {
    const query = `
      SELECT id, email, nom 
      FROM professors 
      WHERE centre_id = ? 
      ORDER BY id DESC
    `;
    const [rows] = await pool.query(query, [centerId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error carregant professors del centre" });
  }
}

// 2. Borrar profesor
export async function deleteUser(req, res) {
  try {
    await pool.query("DELETE FROM professors WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminant usuari" });
  }
}

// (Opcional) Si quieres mantener las funciones antiguas del admin global:
export async function getAllCentres(req, res) {
    try {
        const [rows] = await pool.query("SELECT id, denominacio_completa as nom FROM centres");
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
}