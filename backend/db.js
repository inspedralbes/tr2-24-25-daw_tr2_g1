import mysql from "mysql2/promise"; // Añadimos /promise
import dotenv from "dotenv";

dotenv.config();

const localdbConfig = {
  host: process.env.DB_HOST_LOCAL,
  user: process.env.DB_USER_LOCAL,
  password: process.env.DB_PASSWORD_LOCAL,
  database: process.env.DB_NAME_LOCAL,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
};

export const pool = mysql.createPool(localdbConfig);

// Prueba de conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión a DB exitosa ✅ ");
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a DB:", error.message);
  }
}

testConnection();
