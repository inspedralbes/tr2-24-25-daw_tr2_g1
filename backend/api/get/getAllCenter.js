import { pool } from "../db.js";

// Listar todos los centros
export async function getAllCenter(req, res) {
  try {
    // Consultar BD
    const [rows] = await pool.query("SELECT * FROM centres");
    
    res.json(rows);

  } catch (error) {
    // Error servidor
    res.status(500).json({ error: error.message });
  }
}