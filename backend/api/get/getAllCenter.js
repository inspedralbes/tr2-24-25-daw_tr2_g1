import { pool } from "../db.js";

export async function getAllCenter(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM centres");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
