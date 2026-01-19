import { pool } from "../db.js";

export async function createStudentPI(req, res) {
  console.log("--> HE RECIBIDO ESTO EN EL BODY (PI):", req.body);

  // 1. Desestructuramos los datos.
  // Nota: 'ralc' vendrá del front y lo usaremos para 'alumne_ralc'
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

  // 2. Validamos los campos que son NOT NULL en tu base de datos
  if (!ralc || !professor_id || !ruta_pdf) {
    res.status(400).json({
      error: "Faltan datos obligatorios (RALC, ID Profesor o Ruta PDF)",
    });
    return;
  }

  try {
    // 3. Ejecutamos la inserción
    const [result] = await pool.query(
      `INSERT INTO pis 
      (alumne_ralc, professor_id, dificultat, gravetat, justificacio, proposta_educativa, observacio, ruta_pdf) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ralc,
        professor_id,
        dificultat,
        gravetat,
        justificacio,
        proposta_educativa,
        observacio,
        ruta_pdf,
      ],
    );

    console.log("PI creado con ID:", result.insertId);

    // 4. Devolvemos respuesta de éxito
    res.status(201).json({
      message: "Plan Individualizado creado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    // 5. Manejo de errores
    console.error("Error al crear PI:", error);

    // Error 1452 en MySQL significa que falló una Foreign Key
    // (es decir, el RALC del alumno o el ID del profesor no existen)
    if (error.errno === 1452) {
      res.status(400).json({
        error:
          "No se puede crear el PI: El Alumno (RALC) o el Profesor (ID) no existen.",
      });
    } else {
      res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
  }
}
