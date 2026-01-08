<script setup>
import { reactive, ref } from "vue";

// 1. Estado para los datos del formulario
const form = reactive({
  studentName: "",
  studentId: "", // <--- NUEVO CAMPO
  course: "",
  observations: "",
});

// 2. Estado para el archivo PDF
const pdfFile = ref(null);

// 3. Manejador de la subida de archivo
const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (file && file.type === "application/pdf") {
    pdfFile.value = file;
    console.log("PDF cargado:", file.name);
  } else {
    alert("Por favor, selecciona un archivo PDF válido.");
    event.target.value = null;
  }
};

// 4. Enviar formulario
const handleSubmit = async () => {
  if (!pdfFile.value) {
    alert("Es obligatorio adjuntar el PI en formato PDF");
    return;
  }

  const formData = new FormData();
  formData.append("studentName", form.studentName);
  formData.append("studentId", form.studentId); // <--- SE AÑADE AL ENVÍO
  formData.append("course", form.course);
  formData.append("observations", form.observations);
  formData.append("file", pdfFile.value);

  console.log("Enviando datos...", Object.fromEntries(formData));

  // await $fetch('/api/upload-pi', { method: 'POST', body: formData })
};
</script>

<template>
  <div class="form-container">
    <h1>Registrar Nuevo PI</h1>
    <p class="subtitle">
      Sube el Pla Individualitzat para comenzar el análisis con IA.
    </p>

    <form @submit.prevent="handleSubmit" class="pi-form">
      <div class="form-group">
        <label for="name">Nombre del Alumno:</label>
        <input
          type="text"
          id="name"
          v-model="form.studentName"
          placeholder="Ej: Marc García"
          required
        />
      </div>

      <div class="form-group">
        <label for="studentId">Código RALC / ID Alumno:</label>
        <input
          type="text"
          id="studentId"
          v-model="form.studentId"
          placeholder="Ej: 1234567890"
          required
        />
      </div>

      <div class="form-group">
        <label for="course">Curso / Etapa:</label>
        <select id="course" v-model="form.course" required>
          <option value="" disabled selected>Selecciona una opción</option>
          <option value="4t ESO">4t ESO</option>
          <option value="1r Batxillerat">1r Batxillerat</option>
          <option value="PFI">PFI</option>
        </select>
      </div>

      <div class="form-group">
        <label for="obs">Observaciones Clave (Opcional):</label>
        <textarea
          id="obs"
          v-model="form.observations"
          rows="3"
          placeholder="Ej: Alumno con dislexia, prefiere adaptaciones orales..."
        ></textarea>
      </div>

      <div class="form-group file-upload">
        <label for="pdf">Documento PI (PDF):</label>
        <input
          type="file"
          id="pdf"
          accept=".pdf"
          @change="handleFileUpload"
          required
        />
        <p v-if="pdfFile" class="file-name">
          ✅ Archivo seleccionado: {{ pdfFile.name }}
        </p>
      </div>

      <button type="submit" class="submit-btn">Analizar Documento</button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #444;
}

input[type="text"],
select,
textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.file-upload {
  background: #eef2ff;
  padding: 1rem;
  border-radius: 4px;
  border: 1px dashed #6366f1;
}

.file-name {
  color: green;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.submit-btn {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #1d4ed8;
}
</style>
