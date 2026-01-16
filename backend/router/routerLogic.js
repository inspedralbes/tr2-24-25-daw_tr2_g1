import { Router } from "express";

import { pool } from "../api/db.js";
import { loginCenter } from "../api/login/loginCenter.js";
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

async function getByEmailCenter(req, res) {
  const centerEmail = req.params.email_centre;
  const [result] = await pool.query(
    "SELECT * FROM centres WHERE email_centre = ?",
    [centerEmail]
  );
  res.json(result);
}

// Asignamos una ruta.
router.post("/login", loginCenter);

router.get("/alumnes", getAllStudent);
router.get("/alumne/:ralc", getByRalcStudent);

router.get("/centres", getAllCenter);
router.get("/centre/:email_centre", getByEmailCenter);

export default router;
