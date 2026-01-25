// ============================================
// CONTROLADOR: Crear Plan Individualizado (PI)
// ============================================
// Guarda el análisis del PI generado por IA o introducido manualmente
// Solo puede haber un PI activo por alumno - los anteriores se marcan como inactivos
import { pool } from "../db.js";

export async function createStudentPI(req, res) {
  console.log("--> HE RECIBIDO ESTO EN EL BODY (PI):", req.body);

  const {
    ralc,                  // Código RALC del alumno
    professor_id,          // ID del profesor que crea el PI
    dificultat,            // Dificultades detectadas
    gravetat,              // Gravedad de las dificultades
    justificacio,          // Justificación del PI
    proposta_educativa,    // Propuesta educativa adaptada
    observacio,            // Observaciones adicionales
    ruta_pdf,              // Ruta del PDF generado
  } = req.body;

  // ============================================
  // VALIDACIÓN
  // ============================================
  if (!ralc) {
    res.status(400).json({
      error: "Falta el RALC del alumno.",
    });
    return;
  }

  try {
    // ============================================
    // PASO 1: Desactivar PIs anteriores
    // ============================================
    // Solo puede haber un PI activo por alumno
    await pool.query(
      "UPDATE pis SET estado = 'inactiu' WHERE alumne_ralc = ?",
      [ralc]
    );

    // ============================================
    // PASO 2: Insertar nuevo PI como activo
    // ============================================
    const query = `
      INSERT INTO pis 
      (alumne_ralc, professor_id, dificultat, gravetat, justificacio, proposta_educativa, observacio, ruta_pdf, data_creacio, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'actiu')
    `;

    const values = [
      ralc,
      professor_id || 1,              // Fallback a ID 1 si no se proporciona
      dificultat || null,
      gravetat || null,
      justificacio || null,
      proposta_educativa || null,
      observacio || null,
      ruta_pdf || "archivo_pendiente.pdf",
    ];

    const [result] = await pool.query(query, values);

    console.log("PI creado con ID:", result.insertId);

    res.status(201).json({
      success: true,
      message: "Plan Individualizado creado correctamente y marcado como activo",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear PI:", error);

    if (error.errno === 1452) {
      res.status(400).json({
        success: false,
        error:
          "Error de Relación: El Alumno (RALC) o el Profesor no existen en la base de datos.",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Error interno al guardar en la base de datos",
      });
    }
  }
}
