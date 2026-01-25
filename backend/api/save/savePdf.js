// ============================================
// CONTROLADOR: Guardar PDF del Plan Individualizado
// ============================================
// Gestiona la subida de archivos PDF generados
// Los PDF se guardan con el nombre del RALC del alumno
// Utiliza Multer para el manejo de archivos multipart/form-data
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { pool } from "../db.js";

// ============================================
// CONFIGURACIÓN DE MULTER
// ============================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");

// Crear carpeta uploads si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Recuperar el RALC del body para usar como nombre de archivo
    // IMPORTANTE: En el FormData del frontend, 'ralc' debe añadirse ANTES del archivo
    const ralc = req.body.ralc ? req.body.ralc.trim() : "unknown";

    // Guardar con formato: [RALC].pdf
    // Esto permite recuperar el PDF fácilmente usando el RALC
    cb(null, `${ralc}.pdf`);
  },
});

// Middleware exportado para usar en las rutas
export const uploadMiddleware = multer({ storage: storage });

// ============================================
// CONTROLADOR: Procesar archivo subido
// ============================================
export const savePdfController = async (req, res) => {
  console.log("--- SAVE PDF REQUEST ---");
  console.log("Body:", req.body);
  console.log("File:", req.file);

  try {
    // ============================================
    // VALIDACIÓN 1: Verificar que el archivo fue subido
    // ============================================
    if (!req.file) {
      console.error("Error: No se recibió ningún archivo PDF");
      return res.status(400).json({
        success: false,
        message: "No se ha subido ningún archivo PDF",
      });
    }

    // Extraer datos del formulario (FormData del frontend)
    const { ralc, dificultat, gravetat, justificacio, proposta, observacio, professor_email } =
      req.body;

    // ============================================
    // VALIDACIÓN 2: RALC obligatorio (identifica al alumno)
    // ============================================
    if (!ralc) {
      console.error("Error: Falta el RALC del alumno");
      // Limpiar: borrar el archivo huérfano del sistema
      if (req.file.path) fs.unlinkSync(req.file.path);

      return res
        .status(400)
        .json({ success: false, message: "Falta el RALC del alumno" });
    }

    // ============================================
    // NORMALIZACIÓN: Convertir ruta Windows a formato universal
    // ============================================
    // Windows: C:\uploads\file.pdf → C:/uploads/file.pdf
    const rutaPdf = req.file.path.replace(/\\/g, "/");
    console.log("Ruta PDF normalizada:", rutaPdf);

    // ============================================
    // VALIDACIÓN 3: Verificar que el alumno existe
    // ============================================
    // No se puede crear un PI para un alumno que no está registrado
    const [rows] = await pool.query("SELECT ralc FROM alumnes WHERE ralc = ?", [ralc]);
    if (rows.length === 0) {
      console.error(`Error: El alumno con RALC ${ralc} no existe en la BD.`);
      // Opcional: borrar archivo huérfano
      //if (req.file.path) fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: `El alumno con RALC ${ralc} no existe. No se puede guardar el PI.`
      });
    }

    // ============================================
    // VALIDACIÓN 4: Buscar ID del profesor por email
    // ============================================
    // El frontend envía el email, necesitamos el ID para la BD
    let professorId = null;
    if (professor_email) {
      const [profRows] = await pool.query(
        "SELECT id FROM professors WHERE email = ?", 
        [professor_email]
      );
      if (profRows.length > 0) {
        professorId = profRows[0].id;
        console.log("Profesor encontrado con ID:", professorId);
      } else {
        console.warn("No se encontró profesor con email:", professor_email);
      }
    }

    // ============================================
    // PASO 1: Desactivar PIs anteriores (histórico)
    // ============================================
    // Solo puede haber 1 PI activo por alumno
    await pool.query("UPDATE pis SET estado = 'inactiu' WHERE alumne_ralc = ?", [ralc]);

    // ============================================
    // PASO 2: Insertar nuevo PI como activo
    // ============================================
    const query = `
      INSERT INTO pis 
      (alumne_ralc, professor_id, ruta_pdf, dificultat, gravetat, justificacio, proposta_educativa, observacio, data_creacio, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'actiu')
    `;

    const [result] = await pool.execute(query, [
      ralc,
      professorId, // AGREGAMOS EL ID DEL PROFESOR
      rutaPdf,
      dificultat || null,
      gravetat || null,
      justificacio || null,
      proposta || null, // Mapping correcto con el frontend 'proposta' -> 'proposta_educativa'
      observacio || null,
    ]);

    console.log("Insert exitoso, ID:", result.insertId);

    res.status(200).json({
      success: true,
      message: "PI guardado correctamente",
      id: result.insertId,
      path: rutaPdf,
    });
  } catch (error) {
    console.error("Error al guardar PDF/PI:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al guardar el PI",
      error: error.message,
    });
  }
};
