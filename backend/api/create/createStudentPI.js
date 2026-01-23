import { pool } from "../db.js";

// Crear Plan Individualizado
export async function createStudentPI(req, res) {
  const {
    ralc,
    professor_id,
    dificultat,
    gravetat,
    justificacio,
    proposta_educativa,
    observacio,
    ruta_pdf,
  } = req.body;

  // Validar requerido
  if (!ralc) {
    return res.status(400).json({ error: "Falta el RALC del alumno." });
  }

  try {
    // Desactivar anteriores
    await pool.query(
      "UPDATE pis SET estado = 'inactiu' WHERE alumne_ralc = ?",
      [ralc]
    );

    // Insertar nuevo
    const query = `
      INSERT INTO pis 
      (alumne_ralc, professor_id, dificultat, gravetat, justificacio, proposta_educativa, observacio, ruta_pdf, data_creacio, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'actiu')
    `;

    const values = [
      ralc,
      professor_id || 1, // ID por defecto
      dificultat || null,
      gravetat || null,
      justificacio || null,
      proposta_educativa || null,
      observacio || null,
      ruta_pdf || "archivo_pendiente.pdf",
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Plan creado y activado",
      id: result.insertId,
    });

  } catch (error) {
    console.error("Error createStudentPI:", error);

    // Error relación (FK)
    if (error.errno === 1452) {
      return res.status(400).json({
        success: false,
        error: "Alumno o profesor no existen.",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
}