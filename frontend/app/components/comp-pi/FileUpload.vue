<script setup>
import { ref } from "vue";

// ESTADO
const pdfFile = ref(null);
const isDragging = ref(false);
const fileInput = ref(null);

// ------------------------------------------------------
// 1. MANEJO DE ARCHIVOS (Click y Drag & Drop)
// ------------------------------------------------------

// Click en el botón -> Abre el selector nativo
function triggerFileInput() {
  fileInput.value.click();
}

// Cambio en el input nativo
function handleFileSelect(event) {
  const file = event.target.files[0];
  processFile(file);
}

// Eventos Drag & Drop
function onDragOver() {
  isDragging.value = true;
}
function onDragLeave() {
  isDragging.value = false;
}
function onDrop(event) {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  processFile(file);
}

// Validación y asignación común
function processFile(file) {
  if (!file) return;
  if (file.type !== "application/pdf") {
    alert("Si us plau, puja només arxius PDF.");
    return;
  }
  pdfFile.value = file;
}

function removeFile() {
  pdfFile.value = null;
  if (fileInput.value) fileInput.value.value = ""; // Limpiar input
}

// ------------------------------------------------------
// 2. LÓGICA DE ANÁLISIS (Llamada desde el Padre)
// ------------------------------------------------------
async function triggerAnalysis(studentName) {
  if (!pdfFile.value) {
    alert("Has de seleccionar un PDF primer.");
    return null;
  }

  // AQUÍ VA TU LÓGICA DE CONEXIÓN CON EL BACKEND
  // (He puesto una implementación estándar, ajústala si tu ruta es diferente)
  const formData = new FormData();
  formData.append("pdf", pdfFile.value);
  formData.append("studentName", studentName);

  try {
    // ⚠️ AJUSTA ESTA URL SI TU ENDPOINT ES DIFERENTE
    // Por ejemplo: /api/analyze-pdf o lo que uses en tu backend
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseURL}/api/analyze-pdf`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Error en l'anàlisi del PDF");
    
    const data = await response.json();
    return data; // Devolvemos los datos al padre
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Exponemos las variables y funciones al padre (crear-pi.vue)
defineExpose({
  pdfFile,
  triggerAnalysis
});
</script>

<template>
  <div class="upload-wrapper">
    <input
      type="file"
      ref="fileInput"
      accept="application/pdf"
      class="hidden-input"
      @change="handleFileSelect"
    />

    <div
      v-if="!pdfFile"
      class="drop-zone"
      :class="{ 'active-drag': isDragging }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <div class="icon-cloud">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
      </div>
      <p class="drop-text">
        <span class="highlight">Fes clic per pujar</span> o arrossega el PDF aquí
      </p>
      <p class="drop-subtext">Màxim 10MB (PDF)</p>
    </div>

    <div v-else class="file-preview">
      <div class="file-info">
        <div class="file-icon">📄</div>
        <div class="file-details">
          <p class="file-name">{{ pdfFile.name }}</p>
          <p class="file-size">{{ (pdfFile.size / 1024 / 1024).toFixed(2) }} MB</p>
        </div>
      </div>
      <button @click="removeFile" class="btn-remove" title="Eliminar arxiu">
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
.upload-wrapper {
  width: 100%;
}

.hidden-input {
  display: none;
}

/* --- ZONA DROP --- */
.drop-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background-color: #f8fafc;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.drop-zone:hover {
  border-color: #d9001d; /* Rojo GenCat */
  background-color: #fff5f5;
}

.drop-zone.active-drag {
  border-color: #d9001d;
  background-color: #ffe4e6;
  transform: scale(1.01);
}

.icon-cloud {
  color: #94a3b8;
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
}

.drop-zone:hover .icon-cloud {
  color: #d9001d;
}

.drop-text {
  font-size: 1rem;
  color: #334155;
  margin-bottom: 5px;
}

.highlight {
  color: #d9001d;
  font-weight: 600;
  text-decoration: underline;
}

.drop-subtext {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* --- PREVISUALIZACIÓN ARCHIVO --- */
.file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.file-icon {
  font-size: 2rem;
}

.file-name {
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
  margin: 0;
}

.file-size {
  color: #94a3b8;
  font-size: 0.8rem;
  margin: 0;
}

.btn-remove {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s;
}

.btn-remove:hover {
  background-color: #f1f5f9;
  color: #ef4444;
}
</style>