import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import routerLogic from "./router/routerLogic.js";
import { pool } from "./api/db.js";

const app = express();

const PORT = process.env.PORT_BACKEND || 3000;
const URL = process.env.URL_BACKEND || "http://localhost";

// Configuración relacionada con guradar el pdf.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

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
