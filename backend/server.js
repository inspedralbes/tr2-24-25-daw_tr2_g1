// ============================================
// SERVIDOR BACKEND - API REST PARA EDUPI
// ============================================
import express from "express";
import cors from "cors";
import "dotenv/config"; // Carga variables de entorno desde .env
import path from "path";
import { fileURLToPath } from "url";

import routerLogic from "./router/routerLogic.js";
import { pool } from "./api/db.js";

const app = express();

// --- CORS MANUAL (Mantenemos esta que te funcionaba) ---
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', 'http://edupi.daw.inspedralbes.cat'); // Ojo: En producción es mejor poner el dominio real
   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
   next();
});

// app.use(cors()); <-- COMENTADO O BORRADO para no duplicar cabeceras
app.use(express.json());

const PORT = process.env.PORT_BACKEND || 3000;
const URL = process.env.URL_BACKEND || "http://localhost";

// Configuración para servir archivos estáticos (PDFs subidos)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ============================================
// RUTAS
// ============================================

// Ruta raíz - Verificación de que la API está funcionando
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Todas las rutas de la aplicación están en routerLogic
app.use("/api", routerLogic);

// Servir archivos subidos (PDFs) públicamente
// Accesible en: http://localhost:3000/api/uploads/nombre-archivo.pdf
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================
// INICIO DEL SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en ${URL}:${PORT}`);
  console.log(`Carpeta de descargas pública en: ${URL}:${PORT}/uploads/`);

  // DEBUG: Crear archivo de prueba para verificar que el volumen Docker funciona
  try {
    const testPath = path.join(__dirname, "uploads", "docker_test.txt");
    import("fs").then(fs => {
      fs.writeFileSync(testPath, "Si ves esto, el volumen de Docker funciona correctamente. " + new Date().toISOString());
      console.log("DEBUG: Escribiendo archivo de prueba en:", testPath);
    });
  } catch (e) {
    console.error("DEBUG ERROR: No se pudo escribir en uploads:", e);
  }
});