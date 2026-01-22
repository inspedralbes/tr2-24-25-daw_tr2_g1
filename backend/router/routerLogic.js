import { Router } from "express";
import { pool } from "../api/db.js";


import { loginCenter } from "../api/login/loginCenter.js"; 
import { createStudent } from "../api/create/createStudent.js"; 
import { getAllStudent } from "../api/get/getAllStudent.js"; 
import { getByRalcStudent } from "../api/get/getByRalcStudent.js"; 
import { createStudentPI } from "../api/create/createStudentPI.js"; 
import { getAllCenter } from "../api/get/getAllCenter.js"; 

import { createAdminUser } from "../api/create/createAdminUser.js"; 
import { getUsersByCentreId, deleteUser } from "../api/search/adminSearch.js";

const router = Router();

router.post("/login", loginCenter);

router.get("/alumnes", getAllStudent);
router.post("/alumne", createStudent);
router.get("/alumne/:ralc", getByRalcStudent);

router.post("/alumne/plan_individualitzat", createStudentPI);

router.get("/centres", getAllCenter);

router.get("/centre/:id/users", getUsersByCentreId);
router.post("/admin/create-user", createAdminUser); 
router.delete("/admin/users/:id", deleteUser);



export default router;