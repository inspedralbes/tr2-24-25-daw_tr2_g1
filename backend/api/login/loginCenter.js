// ============================================
// CONTROLADOR: Login de Centros
// ============================================
// Valida que el email corresponda a un centro registrado
// Devuelve información básica del centro si existe
import { pool } from "../db.js";

export async function loginCenter(req, res) {
  const { email } = req.body;

  // ============================================
  // PASO 1: Buscar centro por email
  // ============================================
  const [rows] = await pool.query(
    "SELECT * FROM centres WHERE email_centre = ?",
    [email]
  );

  // VALIDACIÓN: Verificar que el centro existe
  if (rows.length === 0) {
    res
      .status(404)
      .json({ error: "Aquest correu no pertany a cap centre registrat" });
    return;
  }

  const centre = rows[0];

  res.json({
    success: true,
    message: "Login correcte",
    centre: {
      id: centre.id,
      nom: centre.denominacio_completa,
      codi: centre.codi_centre,
      email: centre.email_centre,
    },
  });
}
