// ============================================
// SERVICIO API: Gestión de Alumnos
// ============================================
// Funciones para interactuar con el backend
// Operaciones CRUD para alumnos y Planes Individualizados (PI)

// URL del backend (cambiar según entorno)
const API_URL = ""; // Desarrollo local
//const API_URL = "http://edupi.daw.inspedralbes.cat"; // Producción

// ============================================
// FUNCIÓN: Obtener todos los alumnos
// ============================================
// Devuelve un array con todos los alumnos de la base de datos
export async function getAllStudent() {
  const response = await fetch(`${API_URL}/api/alumnes`);
  const data = await response.json();
  return data;
}

// ============================================
// FUNCIÓN: Buscar alumno por código RALC
// ============================================
// RALC: Registro de Alumnos de Cataluña
// @param ralc - Código RALC del alumno
// @returns Objeto con datos del alumno y su PI
export async function getByRalcStudent(ralc) {
  const response = await fetch(`${API_URL}/api/alumne/${ralc}`);
  const data = await response.json();
  return data;
}

// ============================================
// FUNCIÓN: Crear nuevo alumno
// ============================================
// @param studentData - Objeto con datos del alumno (name, surname, ralc, dni, etc.)
// @returns Objeto con el alumno creado
// @throws Error si el RALC ya existe o hay un error de validación
export async function createStudent(studentData) {
  const response = await fetch(`${API_URL}/api/alumne`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    // Manejar errores del backend (ej: RALC duplicado)
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al crear");
  }

  return await response.json();
}

// ============================================
// FUNCIÓN: Crear Plan Individualizado (PI)
// ============================================
// Guarda el análisis del PI para un alumno existente
// @param piData - Objeto con datos del PI (ralc, dificultat_gravetat, justificacio_pi, etc.)
// @returns Confirmación de creación del PI
// @throws Error si el alumno no existe o hay un error de validación
export async function createStudentPI(piData) {
  const response = await fetch(`${API_URL}/api/alumne/plan_individualitzat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(piData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al guardar el PI");
  }

  return await response.json();
}
