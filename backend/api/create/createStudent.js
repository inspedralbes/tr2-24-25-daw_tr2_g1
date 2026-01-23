import { pool } from "../db.js";

export async function createStudent(req, res) {
  console.log("--> HE RECIBIDO ESTO EN EL BODY:", req.body);

  const { ralc, name, surname, dni, date, course, group, centre_procedencia_id } = req.body;

  if (!ralc || !name) {
    res
      .status(400)
      .json({ error: "Faltan datos obligatorios (RALC y Nombre)" });
    return;
  }

  // VALIDAR QUE SE ENVIÓ EL CENTRO (es obligatorio)
  if (!centre_procedencia_id) {
    console.error("ERROR: No se recibió centre_procedencia_id");
    console.error("Body completo:", req.body);
    res.status(400).json({ 
      error: "Falta el centre_procedencia_id. L'usuari ha d'estar autenticat." 
    });
    return;
  }
  
  console.log("Centre ID a guardar:", centre_procedencia_id);

  try {
    // Manejar fecha: si no hay fecha o es inválida, usar null
    let formattedDate = null;
    if (date) {
      try {
        formattedDate = new Date(date).toISOString().slice(0, 10);
      } catch (e) {
        console.warn("Fecha inválida, se usará NULL");
      }
    }

    // AGREGAMOS centre_procedencia_id A LA QUERY
    const [result] = await pool.query(
      "INSERT INTO alumnes (ralc, nom, cognom, dni, data_naixement, curs, grup, centre_procedencia_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [ralc, name, surname || '', dni || '', formattedDate, course || '', group || '', centre_procedencia_id],
    );
    console.log("Alumno creado con ID:", result.insertId);
    res.json({
      success: true,
      id: result.insertId,
      message: "Alumno creado correctamente",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Ya existe un alumno con este RALC" });
    } else {
      // LOGS DETALLADOS PARA DEBUG
      console.error("Error al crear alumno:", error);
      console.error("Error code:", error.code);
      console.error("Error sqlMessage:", error.sqlMessage);
      res.status(500).json({ 
        error: "Error al guardar en la base de datos",
        details: error.sqlMessage || error.message // Enviar más info al frontend
      });
    }
  }
}
