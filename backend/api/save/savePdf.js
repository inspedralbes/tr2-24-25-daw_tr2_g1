import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { pool } from "../db.js";

// 1. CONFIGURACIÓN DE MULTER
// Aseguramos que la carpeta existe usando RUTA ABSOLUTA
// Asumimos que server.js está en backend/ y uploads/ también en backend/uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Carpeta donde se guardan
  },
  filename: function (req, file, cb) {
    // Generamos nombre único: ralc-timestamp.pdf
    // Intentamos recuperar el RALC del body (debe venir ANTES del archivo en FormData)
    const ralc = req.body.ralc ? req.body.ralc.trim() : "unknown";
    const uniqueSuffix = Date.now();
    // Limpiamos el nombre original de caracteres raros
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");

    // Nombre final: pi-[RALC]-[TIMESTAMP].pdf
    cb(null, `pi-${ralc}-${uniqueSuffix}.pdf`);
  },
});

// Inicializamos el middleware de subida
export const uploadMiddleware = multer({ storage: storage });

// 2. CONTROLADOR (Lógica de Base de Datos)
export const savePdfController = async (req, res) => {
  console.log("--- SAVE PDF REQUEST ---");
  console.log("Body:", req.body);
  console.log("File:", req.file);

  try {
    // req.file contiene el archivo subido
    if (!req.file) {
      console.error("Error: No se recibió ningún archivo PDF");
      return res.status(400).json({
        success: false,
        message: "No se ha subido ningún archivo PDF",
      });
    }

    // req.body contiene los campos de texto enviados por FormData
    const { ralc, dificultat, gravetat, justificacio, proposta, observacio } =
      req.body;

    // VALIDACIÓN BÁSICA
    if (!ralc) {
      console.error("Error: Falta el RALC del alumno");
      // Opcional: Borrar el archivo si no hay RALC, para no dejar basura.
      if (req.file.path) fs.unlinkSync(req.file.path);

      return res
        .status(400)
        .json({ success: false, message: "Falta el RALC del alumno" });
    }

    // Normalizar la ruta del PDF (Windows usa backslashes, mejor usar forward slashes para DB/Web)
    const rutaPdf = req.file.path.replace(/\\/g, "/");
    console.log("Ruta PDF normalizada:", rutaPdf);

    // VERIFICAR QUE EL ALUMNO EXISTE
    const [rows] = await pool.query("SELECT ralc FROM alumnes WHERE ralc = ?", [ralc]);
    if (rows.length === 0) {
      console.error(`Error: El alumno con RALC ${ralc} no existe en la BD.`);
      // Borrar archivo huerfano - DESACTIVADO PARA DEBUG
      //if (req.file.path) fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: `El alumno con RALC ${ralc} no existe. No se puede guardar el PI.`
      });
    }

    // INSERTAR EN LA BASE DE DATOS
    const query = `
      INSERT INTO pis 
      (alumne_ralc, ruta_pdf, dificultat, gravetat, justificacio, proposta_educativa, observacio, data_creacio) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute(query, [
      ralc,
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
