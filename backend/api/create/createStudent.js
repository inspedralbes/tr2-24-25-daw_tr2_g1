import { pool } from "../db.js";

// Crear nuevo alumno
export async function createStudent(req, res) {
  const { ralc, name, surname, dni, date, course, group } = req.body;

  // Validar campos obligatorios
  if (!ralc || !name) {
    return res.status(400).json({ error: "Faltan datos obligatorios (RALC y Nombre)" });
  }

  try {
    // Formatear fecha
    const formattedDate = new Date(date).toISOString().slice(0, 10);

    // Insertar en BD
    const [result] = await pool.query(
      "INSERT INTO alumnes (ralc, nom, cognom, dni, data_naixement, curs, grup) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [ralc, name, surname, dni, formattedDate, course, group]
    );

    res.json({
      success: true,
      id: result.insertId,
      message: "Alumno creado correctamente",
    });

  } catch (error) {
    console.error("Error createStudent:", error);

    // Error duplicado
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Ya existe un alumno con este RALC" });
    }

    // Error servidor
    res.status(500).json({ error: "Error al guardar en la base de datos" });
  }
}