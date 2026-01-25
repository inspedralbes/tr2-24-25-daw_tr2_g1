import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import routerLogic from "./router/routerLogic.js";
import { pool } from "./api/db.js";

const app = express();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://edupi.daw.inspedralbes.cat',
  'https://edupi.daw.inspedralbes.cat'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'Origin', 'X-Requested-With', 'Accept', 'Access-Control-Allow-Request-Method'],
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT_BACKEND || 3000;
const URL = process.env.URL_BACKEND || "http://localhost";
// Configuración relacionada con guradar el pdf.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Routers
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

app.use("/api", routerLogic);

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Servidor arrancado
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en ${URL}:${PORT}`);
  console.log(`Carpeta de descargas pública en: ${URL}:${PORT}/uploads/`);

  // DEBUG: Verificar escritura en uploads
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