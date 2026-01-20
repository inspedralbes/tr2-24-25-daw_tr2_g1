import { Router } from "express";

import { pool } from "../api/db.js";
import { loginCenter } from "../api/login/loginCenter.js"; 
import { createStudent } from "../api/create/createStudent.js"; 
import { createStudentPI } from "../api/create/createStudentPI.js"; 

// --- IMPORTS NUEVOS PARA GESTIÓN DE PROFESORES ---
import { createAdminUser } from "../api/create/createAdminUser.js"; 
import { getUsersByCentreId, deleteUser } from "../api/search/adminSearch.js";

const router = Router();

// ... (Tus funciones existentes de alumnos y centros: getAllStudent, getByRalcStudent, etc.) ...

// ... (Tus rutas existentes de login y alumnos) ...
router.post("/login", loginCenter);
router.get("/alumnes", getAllStudent); // Asegúrate de tener definidos estos handlers arriba
router.post("/alumne", createStudent);
// ... etc ...

// --- RUTAS NUEVAS: PANEL DEL CENTRO ---

// 1. Ver usuarios de UN centro específico (Dashboard)
router.get("/centre/:id/users", getUsersByCentreId);

// 2. Crear usuario (Añadir a la whitelist)
router.post("/admin/create-user", createAdminUser); 

// 3. Borrar usuario
router.delete("/admin/users/:id", deleteUser);

export default router;