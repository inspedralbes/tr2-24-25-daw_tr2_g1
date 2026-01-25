// ============================================
// CONTROLADOR: Listar Todos los Centros
// ============================================
// Devuelve información completa de todos los centros registrados
import { pool } from "../db.js";

export async function getAllCenter(req, res) {
  try {
    // CONSULTA: Obtener todos los campos de la tabla centres
    const [rows] = await pool.query("SELECT * FROM centres");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
