// ============================================
// ROUTER PRINCIPAL - TODAS LAS RUTAS DE LA API
// ============================================
import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { pool } from "../api/db.js";

// Importar controladores de autenticación
import { loginCenter } from "../api/login/loginCenter.js"; // Login para centros educativos
import { loginGoogle } from "../api/login/loginGoogle.js"; // Login con Google OAuth

// Importar controladores de creación
import { createStudent } from "../api/create/createStudent.js"; // Crear alumno
import { createStudentPI } from "../api/create/createStudentPI.js"; // Crear PI de alumno
import { createAdminUser } from "../api/create/createAdminUser.js"; // Crear usuario admin

// Importar controladores de consulta
import { getAllStudent } from "../api/get/getAllStudent.js"; // Listar todos los alumnos
import { getByRalcStudent } from "../api/get/getByRalcStudent.js"; // Buscar alumno por RALC
import { getAllCenter } from "../api/get/getAllCenter.js"; // Listar centros

// Importar controladores de gestión de archivos
import { uploadMiddleware, savePdfController } from "../api/save/savePdf.js"; // Subir PDFs

// Importar controladores de administración
import { getUsersByCentreId, deleteUser } from "../api/search/adminSearch.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// FUNCIÓN: SERVIR PDFs POR RALC DEL ALUMNO
// ============================================
// Los PDFs se guardan con el nombre del RALC del alumno
// Endpoint: GET /api/pdf/:ralc
async function getPDF(req, res) {
  try {
    const { ralc } = req.params;
    
    if (!ralc) {
      return res.status(400).json({ success: false, error: 'RALC no proporcionat' });
    }
    
    // Buscar el PDF en la carpeta uploads usando el RALC como nombre
    const pdfPath = path.join(__dirname, '../uploads', `${ralc}.pdf`);
    
    // Verificar si el archivo existe
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, error: 'PDF no trobat per aquest alumne' });
    }
    
    // Configurar headers para mostrar el PDF en el navegador
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${ralc}.pdf"`);
    
    // Enviar el archivo como stream
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// ============================================
// DEFINICIÓN DE RUTAS
// ============================================

// --- AUTENTICACIÓN ---
router.post("/login", loginCenter); // Login para centros educativos
router.post("/login-google", loginGoogle); // Login con Google OAuth

// --- ALUMNOS ---
router.get("/alumnes", getAllStudent); // Listar todos los alumnos
router.post("/alumne", createStudent); // Crear nuevo alumno
router.get("/alumne/:ralc", getByRalcStudent); // Buscar alumno por código RALC

// --- PLAN INDIVIDUALIZADO (PI) ---
router.post("/alumne/plan_individualitzat", createStudentPI); // Crear PI para un alumno
router.post("/save-pi", uploadMiddleware.single("pdfFile"), savePdfController); // Subir PDF del PI
router.get("/pdf/:ralc", getPDF); // Descargar PDF del PI por RALC

// --- CENTROS EDUCATIVOS ---
router.get("/centres", getAllCenter); // Listar todos los centros
router.get("/centre/:id/users", getUsersByCentreId); // Listar usuarios de un centro

// --- ADMINISTRACIÓN ---
router.post("/admin/create-user", createAdminUser); // Crear usuario administrador
router.delete("/admin/users/:id", deleteUser); // Eliminar usuario

export default router;