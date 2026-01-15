import { pool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  // 1. Leer los datos que vienen del formulario (Frontend)
  const body = await readBody(event);

  // Validación básica (opcional pero recomendada)
  if (!body.ralc || !body.nom) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan datos obligatorios (RALC o Nombre)',
    });
  }

  try {
    // 2. Preparar la consulta SQL
    // Nota: Mapeamos 'cognoms' (frontend) a 'cognom' (base de datos)
    // Nota: 'curs' y 'grup' se ignoran porque no existen en la tabla
    const query = `
      INSERT INTO alumnes (nom, cognom, ralc, dni, data_naixement)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      body.nom,
      body.cognoms,       // En Vue es 'cognoms', en SQL es 'cognom'
      body.ralc,
      body.dni,
      body.dataNaixement // Asegúrate de que llegue en formato YYYY-MM-DD
    ];

    // 3. Ejecutar la consulta
    const [rows] = await pool.execute(query, values);

    // 4. Devolver respuesta al frontend
    return {
      success: true,
      message: 'Alumno creado correctamente',
      id: (rows as any).insertId // Devuelve el ID generado automáticamente
    };

  } catch (error: any) {
    console.error("Error SQL:", error);

    // Manejo de errores específicos (ej: RALC duplicado)
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 409,
        statusMessage: 'El alumno (RALC o DNI) ya existe.',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno de base de datos',
    });
  }
});