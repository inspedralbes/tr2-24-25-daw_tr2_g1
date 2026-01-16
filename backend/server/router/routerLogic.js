import { Router } from "express";
import { pool } from "../../db.js";

const router = Router();

// Funciones que luego les asignamos una ruta.
async function getAllStudent(req, res) {
  const [rows] = await pool.query("SELECT * FROM alumnes");
  res.json(rows);
}

async function getByRalcStudent(req, res) {
  const studentRalc = req.params.ralc;

  const [result] = await pool.query("SELECT * FROM alumnes WHERE ralc = ?", [
    studentRalc,
  ]);
  res.json(result);
}

async function getAllCenter(req, res) {
  const [rows] = await pool.query("SELECT * FROM centres");
  res.json(rows);
}

// Asignamos una ruta.
router.get("/alumnes", getAllStudent);
router.get("/alumne/:ralc", getByRalcStudent);

router.get("/centres", getAllCenter);

export default router;
