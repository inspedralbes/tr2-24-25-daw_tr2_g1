// ============================================
// CONTROLADORES: Gestión de Profesores y Centros (Dashboard Admin)
// ============================================
import { pool } from "../db.js";

// ============================================
// FUNCIÓN: Obtener profesores de un centro
// ============================================
// Lista todos los profesores autorizados para un centro específico
export async function getUsersByCentreId(req, res) {
  const centerId = req.params.id; 

  try {
    // CONSULTA: Obtener profesores ordenados por ID descendente (más recientes primero)
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

// ============================================
// FUNCIÓN: Eliminar profesor
// ============================================
// Permite a un admin de centro desautorizar a un profesor
export async function deleteUser(req, res) {
  try {
    // ELIMINACIÓN: Borrar profesor de la base de datos
    await pool.query("DELETE FROM professors WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminant usuari" });
  }
}

// ============================================
// FUNCIÓN: Listar todos los centros
// ============================================
// Devuelve lista completa de centros (usado en selects/dropdowns)
export async function getAllCentres(req, res) {
    try {
        // CONSULTA: Obtener ID y nombre de todos los centros
        const [rows] = await pool.query("SELECT id, denominacio_completa as nom FROM centres");
        res.json({ success: true, data: rows });
    } catch (e) { res.status(500).json({ error: e.message }); }
}