import { API_URL } from '../config/api.js';

export async function getAllStudent() {
  const response = await fetch(`${API_URL}/api/alumnes`);
  const data = await response.json();
  return data;
}

export async function getByRalcStudent(ralc) {
  const response = await fetch(`${API_URL}/api/alumne/${ralc}`);
  const data = await response.json();
  return data;
}

export async function createStudent(studentData) {
  const response = await fetch(`${API_URL}/api/alumne`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Importante: avisar que enviamos JSON
    },
    body: JSON.stringify(studentData), // Convertimos el objeto a texto
  });

  if (!response.ok) {
    // Si el backend devuelve error (ej: RALC duplicado), lanzamos el error
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al crear");
  }

  return await response.json();
}

export async function createStudentPI(piData) {
  // Asegúrate de que esta URL coincida con tu routes.js del backend.
  // En pasos anteriores usamos '/api/pis', aquí he puesto la que usaste en tu ejemplo.
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
