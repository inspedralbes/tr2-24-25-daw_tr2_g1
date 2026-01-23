const API_URL = "http://localhost:3000";

// Obtener todos los alumnos
export async function getAllStudent() {
  const response = await fetch(`${API_URL}/api/alumnes`);
  const data = await response.json();
  return data;
}

// Obtener alumno por RALC
export async function getByRalcStudent(ralc) {
  const response = await fetch(`${API_URL}/api/alumne/${ralc}`);
  const data = await response.json();
  return data;
}

// Crear nuevo alumno
export async function createStudent(studentData) {
  const response = await fetch(`${API_URL}/api/alumne`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al crear");
  }

  return await response.json();
}

// Crear Plan Individualizado (PI)
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