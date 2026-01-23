import { pool } from "../db.js";

// Login de centro
export async function loginCenter(req, res) {
  const { email } = req.body;

  try {
    // Consultar centro
    const [rows] = await pool.query(
      "SELECT * FROM centres WHERE email_centre = ?",
      [email]
    );

    // Validar existencia
    if (rows.length === 0) {
      return res.status(404).json({ 
        error: "Aquest correu no pertany a cap centre registrat" 
      });
    }

    const centre = rows[0];

    // Respuesta exitosa
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

  } catch (error) {
    // Error servidor
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
}