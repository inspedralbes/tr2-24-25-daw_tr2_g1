const models = require('./models');
const path = require('path');
const fs = require('fs');

const loginCentre = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Falta el correu electrònic' });
    }

    try {
        const centre = await models.getCentreByEmail(email);

        if (centre) {
            res.json({
                success: true,
                message: 'Login correcte',
                centre: {
                    id: centre.id,
                    nom: centre.denominacio_completa,
                    codi: centre.codi_centre,
                    email: centre.email_centre // Keeping consistent with previous logic
                }
            });
        } else {
            res.status(404).json({ error: 'Aquest correu no pertany a cap centre registrat' });
        }
    } catch (error) {
        console.error('Error en loginCentre:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const createPIRecord = async (req, res) => {
    // req.file contains the uploaded file
    // req.body contains text fields: studentData (string), aiText, professorId

    // 1. Validate inputs
    if (!req.file) {
        return res.status(400).json({ error: 'Falta el fitxer PDF' });
    }

    let studentData;
    try {
        studentData = JSON.parse(req.body.studentData);
    } catch (e) {
        return res.status(400).json({ error: 'Format de dades de l\'alumne incorrecte' });
    }

    const { aiText, professorId } = req.body;

    if (!aiText || !professorId || !studentData) {
        return res.status(400).json({ error: 'Falten dades obligatòries' });
    }

    // Start transaction logic (implied, or just sequential steps)
    // Ideally we should use a transaction but for now sequential is fine for this scope.

    try {
        // 2. Handle Student
        // Check if student exists by DNI
        let alumne = await models.getAlumneByDNI(studentData.dni);
        let alumneId;

        if (alumne) {
            alumneId = alumne.id;
        } else {
            // Create new student
            alumneId = await models.createAlumne({
                nom: studentData.nom,
                cognom: studentData.cognoms, // Note: Frontend sends 'cognoms', DB has 'cognom'. Mapping here.
                ralc: studentData.ralc,
                dni: studentData.dni,
                data_naixement: studentData.dataNaixement, // Frontend sends camelCase 'dataNaixement', DB 'data_naixement' handled in model
                centre_procedencia_id: studentData.centreProcedenciaId // Optional
            });
        }

        // 3. Create PI
        // File path logic: we store the relative path or absolute?
        // Usually relative to uploads or server root.
        // req.file.path gives path like 'back/uploads/filename'.
        const rutaPdf = req.file.path;

        await models.createPI({
            alumne_id: alumneId,
            professor_id: professorId,
            estat: 'pendent', // Default state
            ruta_pdf: rutaPdf,
            dades_ia: aiText
        });

        res.json({ success: true, message: 'PI creat correctament' });

    } catch (error) {
        console.error('Error en createPIRecord:', error);
        // Clean up file if error? (Optional improvement)
        res.status(500).json({ error: 'Error al crear el PI' });
    }
};

// Get all alumnes with their centre information
const getAllAlumnes = async (req, res) => {
    try {
        const alumnes = await models.getAllAlumnes();
        res.json({ success: true, data: alumnes });
    } catch (error) {
        console.error('Error obteniendo alumnos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get alumne by RALC with their PIs
const getAlumneByRalc = async (req, res) => {
    try {
        const { ralc } = req.params;
        const alumne = await models.getAlumneByRalc(ralc);

        if (!alumne) {
            return res.status(404).json({ success: false, error: 'Alumne no trobat' });
        }

        res.json({ success: true, data: alumne });
    } catch (error) {
        console.error('Error obteniendo alumno:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const createAlumneEndpoint = async (req, res) => {
    try {
        const { nom, cognom, ralc, dni, data_naixement, centre_procedencia_id } = req.body;

        if (!nom || !cognom || !ralc || !dni) {
            return res.status(400).json({ success: false, error: 'Falten camps obligatoris (nom, cognom, ralc, dni)' });
        }

        const newId = await models.createAlumne({ nom, cognom, ralc, dni, data_naixement, centre_procedencia_id });
        res.json({ success: true, message: 'Alumne creat correctament', id: newId });
    } catch (error) {
        console.error('Error creating alumne:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, error: 'Ja existeix un alumne amb aquest DNI o RALC' });
        }
        res.status(500).json({ success: false, error: 'Error al crear l\'alumne' });
    }
};

module.exports = {
    loginCentre,
    createPIRecord,
    getAllAlumnes,
    getAlumneByRalc,
    createAlumneEndpoint
};
