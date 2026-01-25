// ============================================
// CONFIGURACIÓN DE BASE DE DATOS MYSQL
// ============================================
// Pool de conexiones para mejor rendimiento
// Reutiliza conexiones en lugar de crear nuevas para cada consulta
import mysql from "mysql2/promise"; 
import dotenv from "dotenv";

dotenv.config();

// Configuración de conexión con fallback a variables locales
const localdbConfig = {
  host: process.env.DB_HOST || process.env.DB_HOST_LOCAL,
  user: process.env.DB_USER || process.env.DB_USER_LOCAL,
  password: process.env.DB_PASSWORD || process.env.DB_PASSWORD_LOCAL,
  database: process.env.DB_NAME || process.env.DB_NAME_LOCAL,
  connectionLimit: 10, // Máximo 10 conexiones simultáneas
  waitForConnections: true, // Esperar si no hay conexiones disponibles
  queueLimit: 0, // Sin límite de cola de espera
};

// Pool exportado para usar en toda la aplicación
export const pool = mysql.createPool(localdbConfig);

// ============================================
// VERIFICACIÓN DE CONEXIÓN AL INICIO
// ============================================
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión a DB exitosa ✅ ");
    connection.release(); // Liberar la conexión de vuelta al pool
  } catch (error) {
    console.error("❌ Error conectando a DB:", error.message);
  }
}

testConnection();
