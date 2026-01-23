import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { pool } from "../db.js";

// Configuración directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");

// Crear carpeta si falta
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nombrar archivo (RALC)
    const ralc = req.body.ralc ? req.body.ralc.trim() : "unknown";
    cb(null, `${ralc}.pdf`);
  },
});

export const uploadMiddleware = multer({ storage });

// Controlador guardar PI
export const savePdfController = async (req, res) => {
  try {
    // Validar archivo
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No se ha subido archivo" });
    }

    const { ralc, dificultat, gravetat, justificacio, proposta, observacio } = req.body;

    // Validar datos
    if (!ralc) {
      if (req.file.path) fs.unlinkSync(req.file.path); // Borrar huérfano
      return res.status(400).json({ success: false, message: "Falta el RALC" });
    }

    // Normalizar ruta
    const rutaPdf = req.file.path.replace(/\\/g, "/");

    // Verificar alumno
    const [rows] = await pool.query("SELECT ralc FROM alumnes WHERE ralc = ?", [ralc]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Alumno no existe" });
    }

    // Desactivar anteriores
    await pool.query("UPDATE pis SET estado = 'inactiu' WHERE alumne_ralc = ?", [ralc]);

    // Insertar nuevo PI
    const query = `
      INSERT INTO pis 
      (alumne_ralc, ruta_pdf, dificultat, gravetat, justificacio, proposta_educativa, observacio, data_creacio, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'actiu')
    `;

    const [result] = await pool.execute(query, [
      ralc,
      rutaPdf,
      dificultat || null,
      gravetat || null,
      justificacio || null,
      proposta || null,
      observacio || null,
    ]);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: "PI guardado correctamente",
      id: result.insertId,
      path: rutaPdf,
    });

  } catch (error) {
    // Error servidor
    console.error("Error savePdfController:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};