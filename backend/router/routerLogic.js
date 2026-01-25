import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";


import { pool } from "../api/db.js";

import { loginCenter } from "../api/login/loginCenter.js"; // LOGIN CENTRO
import { loginGoogle } from "../api/login/loginGoogle.js"; // LOGIN GOOGLE
import { createStudent } from "../api/create/createStudent.js"; // CREAR ALUMNO
import { getAllStudent } from "../api/get/getAllStudent.js"; // LISTAR TODOS LOS ALUMNOS
import { getByRalcStudent } from "../api/get/getByRalcStudent.js"; // BUSCAR ALUMNO PI
import { createStudentPI } from "../api/create/createStudentPI.js"; // CREAR ALUMNO PI
import { getAllCenter } from "../api/get/getAllCenter.js"; // CREAR CENTRO
import { uploadMiddleware, savePdfController } from "../api/save/savePdf.js"; // SUBIR Y GUARDAR PDF/PI
import { createAdminUser } from "../api/create/createAdminUser.js"; 
import { getUsersByCentreId, deleteUser } from "../api/search/adminSearch.js";


const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para servir PDFs
// Función para servir PDFs identificados por RALC del alumno
async function getPDF(req, res) {
  try {
    const { ralc } = req.params;
    
    if (!ralc) {
      return res.status(400).json({ success: false, error: 'RALC no proporcionat' });
    }
    
    // El PDF se guarda en la carpeta uploads con el nombre del RALC
    const pdfPath = path.join(__dirname, '../uploads', `${ralc}.pdf`);
    
    // Verificar si el archivo existe
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, error: 'PDF no trobat per aquest alumne' });
    }
    
    // Establecer headers para el PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${ralc}.pdf"`);
    
    // Enviar el archivo
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
// Asignamos una ruta.
router.post("/login", loginCenter);
router.post("/login-google", loginGoogle);

router.get("/alumnes", getAllStudent);
router.post("/alumne", createStudent);
router.get("/alumne/:ralc", getByRalcStudent);

router.post("/alumne/plan_individualitzat", createStudentPI);

router.get("/centres", getAllCenter);
router.get("/centre/:id/users", getUsersByCentreId);
router.post("/admin/create-user", createAdminUser); 
router.delete("/admin/users/:id", deleteUser);
router.post("/save-pi", uploadMiddleware.single("pdfFile"), savePdfController);
// Ruta para servir PDFs identificados por RALC
router.get("/pdf/:ralc", getPDF);
export default router;