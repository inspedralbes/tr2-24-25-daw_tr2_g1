// ============================================
// CONTROLADOR: Obtener Alumno por RALC
// ============================================
// Devuelve datos completos del alumno + todos sus PIs asociados
// Incluye información del centro y profesores que crearon PIs
import { pool } from "../db.js";

export async function getByRalcStudent(req, res) {
  try {
    const studentRalc = req.params.ralc;

    // ============================================
    // PASO 1: Obtener datos básicos del alumno
    // ============================================
    // Incluye JOIN con centros para mostrar nombre del centro
    const [alumnes] = await pool.query(
      `
      SELECT 
        a.ralc,
        a.nom,
        a.cognom as cognoms,
        a.dni,
        a.data_naixement as dataNaixement,
        a.curs,
        a.grup,
        c.denominacio_completa as centreProcedencia
      FROM alumnes a
      LEFT JOIN centres c ON a.centre_procedencia_id = c.id
      WHERE a.ralc = ?
    `,
      [studentRalc],
    );

    // VALIDACIÓN: Verificar que el alumno existe
    if (alumnes.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Alumne no trobat" });
    }

    const alumne = alumnes[0];

    // ============================================
    // PASO 2: Obtener todos los PIs del alumno
    // ============================================
    // Ordenados por estado (activo primero) y luego por fecha descendente
    const [pis] = await pool.query(
      `
      SELECT 
        pi.id,
        pi.ruta_pdf,
        pi.data_creacio,
        pi.dificultat,    
        pi.gravetat,
        pi.justificacio,
        pi.proposta_educativa,
        pi.observacio,
        pi.estado,         
        p.nom as professorNom,
        p.email as professorEmail
      FROM pis pi
      LEFT JOIN professors p ON pi.professor_id = p.id
      WHERE pi.alumne_ralc = ?
      ORDER BY 
        CASE WHEN pi.estado = 'actiu' THEN 0 ELSE 1 END,
        pi.data_creacio DESC
    `,
      [studentRalc],
    );

    alumne.pis = pis || [];

    res.json({ success: true, data: alumne });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
