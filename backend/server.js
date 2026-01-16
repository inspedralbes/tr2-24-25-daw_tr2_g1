import express from "express";
import cors from "cors";
import "dotenv/config";

import routerLogic from "./router/routerLogic.js";
import { pool } from "./db.js";

const app = express();

const PORT = process.env.PORT_BACKEND || 3000;
const URL = process.env.URL_BACKEND || "http://localhost";

app.use(cors());
app.use(express.json());

// Routers

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

app.use("/api", routerLogic);

// Servidor arrancado
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en ${URL}:${PORT}`);
});
