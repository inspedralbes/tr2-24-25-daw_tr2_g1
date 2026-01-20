import { pool } from "../db.js";

export async function createStudent(req, res) {
  console.log("--> HE RECIBIDO ESTO EN EL BODY:", req.body);

  const { ralc, name, surname, dni, date, course, group } = req.body;

  if (!ralc || !name) {
    res
      .status(400)
      .json({ error: "Faltan datos obligatorios (RALC y Nombre)" });
    return;
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO alumnes (ralc, nom, cognom, dni, data_naixement, curs, grup) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [ralc, name, surname, dni, date, course, group],
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
      console.error("Error al crear alumno:", error);
      res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
  }
}
