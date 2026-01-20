import { pool } from "../db.js";

export async function getAllStudent(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.ralc,
        a.nom,
        a.cognom as cognoms,
        a.dni,
        a.data_naixement as dataNaixement,
        c.denominacio_completa as centreProcedencia
      FROM alumnes a
      LEFT JOIN centres c ON a.centre_procedencia_id = c.id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
