import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import fs from "fs"; 
import { fileURLToPath } from "url";

// Importación rutas y DB
import routerLogic from "./router/routerLogic.js";
import { pool } from "./api/db.js";

const app = express();

// Configuración entorno
const PORT = process.env.PORT_BACKEND || 3000;
const URL = process.env.URL_BACKEND || "http://localhost";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middlewares ---

// CORS Manual (Prioridad)
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*'); 
   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
   next();
});

// Parseo JSON
app.use(express.json());

// --- Rutas ---

// Test conexión
app.get("/", (req, res) => {
 res.send("API funcionando correctamente");
});

// Rutas API
app.use("/api", routerLogic);

// Archivos estáticos
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// --- Servidor ---

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en ${URL}:${PORT}`);
  console.log(`Carpeta de descargas pública en: ${URL}:${PORT}/uploads/`);

  // Debug escritura Docker
  try {
    const testPath = path.join(__dirname, "uploads", "docker_test.txt");
    fs.writeFileSync(testPath, "Si ves esto, el volumen de Docker funciona correctamente. " + new Date().toISOString());
    console.log("DEBUG: Escribiendo archivo de prueba en:", testPath);
  } catch (e) {
    console.error("DEBUG ERROR: No se pudo escribir en uploads:", e);
  }
});