import { Router } from "express";

import { pool } from "../api/db.js";
import { loginCenter } from "../api/login/loginCenter.js"; // LOGIN CENTRO
import { createStudent } from "../api/create/createStudent.js"; // CREAR ALUMNO
import { createStudentPI } from "../api/create/createStudentPI.js"; // CREAR ALUMNO PI

const router = Router();

// Funciones que luego les asignamos una ruta.
async function getAllStudent(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.ralc,
        a.nom,
        a.cognom as cognoms,
        a.dni,
        a.data_naixement as dataNaixement,
        c.denominacio_completa as centreProcedencia
      FROM alumnes a
      LEFT JOIN centres c ON a.centre_procedencia_id = c.id
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getByRalcStudent(req, res) {
  try {
    const studentRalc = req.params.ralc;

    // A) Obtener datos básicos del alumno
    const [alumnes] = await pool.query(
      `
      SELECT 
        a.id,
        a.ralc,
        a.nom,
        a.cognom as cognoms,
        a.dni,
        a.data_naixement as dataNaixement,
        c.denominacio_completa as centreProcedencia
      FROM alumnes a
      LEFT JOIN centres c ON a.centre_procedencia_id = c.id
      WHERE a.ralc = ?
    `,
      [studentRalc],
    );

    if (alumnes.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Alumne no trobat" });
    }

    const alumne = alumnes[0];

    // B) Obtener PIs del alumno
    const [pis] = await pool.query(
      `
      SELECT 
        pi.id,
        pi.estat,
        pi.ruta_pdf,
        pi.data_creacio,
        pi.dades_ia,
        p.nom as professorNom,
        p.email as professorEmail
      FROM pis pi
      LEFT JOIN professors p ON pi.professor_id = p.id
      WHERE pi.alumne_id = ?
    `,
      [alumnes[0].id],
    );

    alumne.pis = pis || [];

    res.json({ success: true, data: alumne });
  } catch (error) {
    console.error(error); // Añadido para ver errores en consola del servidor
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getAllCenter(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM centres");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getByEmailCenter(req, res) {
  const centerEmail = req.params.email_centre;
  const [result] = await pool.query(
    "SELECT * FROM centres WHERE email_centre = ?",
    [centerEmail],
  );
  res.json(result);
}

// Asignamos una ruta.
router.post("/login", loginCenter);

router.get("/alumnes", getAllStudent);
router.post("/alumne", createStudent);
router.get("/alumne/:ralc", getByRalcStudent);

router.post("/alumne/plan_individualitzat", createStudentPI);

router.get("/centres", getAllCenter);
router.get("/centre/:email_centre", getByEmailCenter);

export default router;
