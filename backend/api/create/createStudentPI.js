import { pool } from "../db.js";

export async function createStudentPI(req, res) {
  console.log("--> HE RECIBIDO ESTO EN EL BODY (PI):", req.body);

  const {
    ralc,
    professor_id, // Asegúrate de enviar esto desde el front (o hardcodeado por ahora)
    dificultat,
    gravetat,
    justificacio,
    proposta_educativa,
    observacio,
    ruta_pdf, // Puede ser el nombre del archivo si no lo guardas en disco aún
  } = req.body;

  // 1. Validación básica.
  // Nota: Si 'ruta_pdf' no es crítica, quítala de aquí.
  if (!ralc) {
    res.status(400).json({
      error: "Falta el RALC del alumno.",
    });
    return;
  }

  try {
    // 2. Ejecutamos la lógica de actualización e inserción

    // a) Marcar PIs anteriores como 'inactiu'
    await pool.query(
      "UPDATE pis SET estado = 'inactiu' WHERE alumne_ralc = ?",
      [ralc]
    );

    // b) Insertar el nuevo PI activo
    const query = `
      INSERT INTO pis 
      (alumne_ralc, professor_id, dificultat, gravetat, justificacio, proposta_educativa, observacio, ruta_pdf, data_creacio, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'actiu')
    `;

    const values = [
      ralc,
      professor_id || 1, // Fallback: Si no llega ID, asigna el 1 (asegúrate que existe un profe con id 1)
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
