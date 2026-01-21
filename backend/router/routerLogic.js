import { Router } from "express";
import { pool } from "../api/db.js";

// --- TUS IMPORTS ACTUALES ---
import { loginCenter } from "../api/login/loginCenter.js"; 
import { createStudent } from "../api/create/createStudent.js"; 
import { getAllStudent } from "../api/get/getAllStudent.js"; 
import { getByRalcStudent } from "../api/get/getByRalcStudent.js"; 
import { createStudentPI } from "../api/create/createStudentPI.js"; 
import { getAllCenter } from "../api/get/getAllCenter.js"; 

// --- 👇 IMPORTS NUEVOS QUE FALTABAN (Para gestionar Profesores) 👇 ---
import { createAdminUser } from "../api/create/createAdminUser.js"; 
import { getUsersByCentreId, deleteUser } from "../api/search/adminSearch.js";
// ---------------------------------------------------------------------

const router = Router();

// --- TUS RUTAS ACTUALES ---
router.post("/login", loginCenter);

router.get("/alumnes", getAllStudent);
router.post("/alumne", createStudent);
router.get("/alumne/:ralc", getByRalcStudent);

router.post("/alumne/plan_individualitzat", createStudentPI);

router.get("/centres", getAllCenter);

// --- 👇 RUTAS NUEVAS (PANEL DE CONTROL DEL CENTRO) 👇 ---

// 1. Ver lista de profesores de UN centro (Dashboard)
router.get("/centre/:id/users", getUsersByCentreId);

// 2. Crear profesor (Añadir a la whitelist con parche de password)
router.post("/admin/create-user", createAdminUser); 

// 3. Borrar profesor
router.delete("/admin/users/:id", deleteUser);

// -------------------------------------------------------

export default router;