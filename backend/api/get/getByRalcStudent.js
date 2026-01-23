import { pool } from "../db.js";

// Obtener alumno y sus planes
export async function getByRalcStudent(req, res) {
  try {
    const studentRalc = req.params.ralc;

    // Consultar alumno
    const [alumnes] = await pool.query(
      `SELECT 
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
      WHERE a.ralc = ?`,
      [studentRalc]
    );

    // Validar existencia
    if (alumnes.length === 0) {
      return res.status(404).json({ success: false, error: "Alumne no trobat" });
    }

    const alumne = alumnes[0];

    // Consultar planes (PIs)
    const [pis] = await pool.query(
      `SELECT 
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
        pi.data_creacio DESC`,
      [studentRalc]
    );

    // Adjuntar historial
    alumne.pis = pis || [];

    res.json({ success: true, data: alumne });

  } catch (error) {
    console.error(error);
    
    // Error servidor
    res.status(500).json({ success: false, error: error.message });
  }
}