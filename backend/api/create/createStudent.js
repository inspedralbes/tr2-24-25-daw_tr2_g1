// ============================================
// CONTROLADOR: Crear Nuevo Alumno
// ============================================
// Registra un alumno en la base de datos
// Vincula al alumno con el centro educativo que lo crea
import { pool } from "../db.js";

export async function createStudent(req, res) {
  console.log("--> HE RECIBIDO ESTO EN EL BODY:", req.body);

  const { ralc, name, surname, dni, date, course, group, centre_procedencia_id } = req.body;

  // ============================================
  // VALIDACIÓN DE DATOS OBLIGATORIOS
  // ============================================
  if (!ralc || !name) {
    res
      .status(400)
      .json({ error: "Faltan datos obligatorios (RALC y Nombre)" });
    return;
  }

  // El centro es obligatorio - identifica quién creó al alumno
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
    // ============================================
    // FORMATEO DE FECHA DE NACIMIENTO
    // ============================================
    // Convertir a formato MySQL (YYYY-MM-DD) o usar NULL si no es válida
    let formattedDate = null;
    if (date) {
      try {
        formattedDate = new Date(date).toISOString().slice(0, 10);
      } catch (e) {
        console.warn("Fecha inválida, se usará NULL");
      }
    }

    // ============================================
    // INSERCIÓN EN BASE DE DATOS
    // ============================================
    const [result] = await pool.query(
      "INSERT INTO alumnes (ralc, nom, cognom, dni, data_naixement, curs, grup, centre_procedencia_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [ralc, name, surname || '', dni || '', formattedDate, course || '', group || '', centre_procedencia_id],
    );
    console.log("Alumno creado con ID:", result.insertId);
    
    // Respuesta exitosa
    res.json({
      success: true,
      id: result.insertId,
      message: "Alumno creado correctamente",
    });
  } catch (error) {
    // ============================================
    // MANEJO DE ERRORES ESPECÍFICOS
    // ============================================
    
    // ERROR 1: RALC duplicado (clave única en BD)
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Ya existe un alumno con este RALC" });
    } else {
      // ERROR 2: Otros errores de BD (sintaxis, conexión, etc.)
      console.error("Error al crear alumno:", error);
      console.error("Error code:", error.code);
      console.error("Error sqlMessage:", error.sqlMessage);
      
      res.status(500).json({ 
        error: "Error al guardar en la base de datos",
        details: error.sqlMessage || error.message
      });
    }
  }
}
