import { Router } from "express";

import { pool } from "../api/db.js";

import { loginCenter } from "../api/login/loginCenter.js"; // LOGIN CENTRO
import { createStudent } from "../api/create/createStudent.js"; // CREAR ALUMNO
import { getAllStudent } from "../api/get/getAllStudent.js"; // LISTAR TODOS LOS ALUMNOS
import { getByRalcStudent } from "../api/get/getByRalcStudent.js"; // BUSCAR ALUMNO PI
import { createStudentPI } from "../api/create/createStudentPI.js"; // CREAR ALUMNO PI
import { getAllCenter } from "../api/get/getAllCenter.js"; // CREAR CENTRO
import { uploadMiddleware, savePdfController } from "../api/save/savePdf.js"; // SUBIR Y GUARDAR PDF/PI

const router = Router();

// Asignamos una ruta.
router.post("/login", loginCenter);

router.get("/alumnes", getAllStudent);
router.post("/alumne", createStudent);
router.get("/alumne/:ralc", getByRalcStudent);

router.post("/alumne/plan_individualitzat", createStudentPI);

router.get("/centres", getAllCenter);

router.post("/save-pi", uploadMiddleware.single("pdfFile"), savePdfController);

export default router;
