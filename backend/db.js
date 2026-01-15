import mysql from "mysql2";
import dotenv from "dotenv";

// Cargar las variables del archivo .env
dotenv.config();

const localdbConfig = {
  host: process.env.DB_HOST_LOCAL,
  user: process.env.DB_USER_LOCAL,
  password: process.env.DB_PASSWORD_LOCAL,
  database: process.env.DB_NAME_LOCAL,
  connectionLimit: 10,
};

export const pool = mysql.createPool(localdbConfig);
