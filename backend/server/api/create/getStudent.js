import { pool } from "~/db.js";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const ralc = query.ralc; // Puede ser undefined si no lo envían

  console.log("--- INICIO DEBUG ---");

  // 1. Preparamos la consulta dependiendo de si hay RALC o no
  let sql;
  let params;

  if (ralc) {
    console.log(`🔍 Modo: Buscando alumno específico (RALC: ${ralc})`);
    sql = "SELECT * FROM alumnos WHERE ralc = ?";
    params = [ralc];
  } else {
    console.log("📂 Modo: Buscando TODOS los alumnos");
    // Opcional: Agrega "LIMIT 100" si tienes muchísimos alumnos para no bloquear la app
    sql = "SELECT * FROM alumnos";
    params = [];
  }

  return new Promise((resolve, reject) => {
    console.log("2. Ejecutando SQL:", sql);

    pool.query(sql, params, (err, results) => {
      if (err) {
        console.error("❌ ERROR DB:", err.message);
        reject(createError({ statusCode: 500, statusMessage: err.message }));
      } else {
        console.log(`✅ Éxito. Resultados encontrados: ${results.length}`);

        // LOGICA DE RESPUESTA:
        if (ralc) {
          // Si pidió uno específico, devolvemos el OBJETO (o null si no existe)
          resolve(results.length > 0 ? results[0] : null);
        } else {
          // Si pidió todos, devolvemos el ARRAY completo
          resolve(results);
        }
      }
    });
  });
});
