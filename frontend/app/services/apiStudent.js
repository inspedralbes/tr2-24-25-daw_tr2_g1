const API_URL = "http://localhost:3000";

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
