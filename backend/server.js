import express from "express";
import cors from "cors";
import "dotenv/config";

import routerLogic from "./router/routerLogic.js";
import { pool } from "./api/db.js";

const app = express();

// --- CORS MANUAL (Mantenemos esta que te funcionaba) ---
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*'); // Ojo: En producción es mejor poner el dominio real
   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
   next();
});

// app.use(cors()); <-- COMENTADO O BORRADO para no duplicar cabeceras
app.use(express.json());

const PORT = process.env.PORT_BACKEND || 3000;
const URL = process.env.URL_BACKEND || "http://localhost";

// Routers
app.get("/", (req, res) => {
 res.send("API funcionando correctamente");
});

app.use("/api", routerLogic);

// Servidor arrancado
app.listen(PORT, () => {
 console.log(`Servidor backend escuchando en ${URL}:${PORT}`);
});