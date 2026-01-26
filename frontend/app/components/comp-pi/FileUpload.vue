<script setup>
// ============================================
// COMPONENTE: Subida y Análisis de PDF
// ============================================
// Permite subir un archivo PDF con drag & drop o click
// Extrae el texto del PDF usando pdf.js
// Envía el texto a Gemini AI para análisis del PI
import * as pdfjsLib from 'pdfjs-dist';

// Configurar el worker de PDF.js (debe coincidir con la versión instalada)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

import { useGemini } from "../../composables/useGemini";

// ============================================
// COMPOSABLES Y ESTADO
// ============================================
const { analyzePdfContent, error: aiError, aiResponse } = useGemini();

const statusMessage = ref("");  // Mensaje de estado durante el procesamiento
const errorMsg = ref("");       // Mensajes de error
const isProcessing = ref(false); // Estado de carga
const pdfFile = ref(null);       // Archivo PDF seleccionado
const isDragging = ref(false);   // Estado visual del drag & drop
const fileInput = ref(null);     // Referencia al input oculto

// ============================================
// MANEJO DE ARCHIVOS - Click y Drag & Drop
// ============================================

// Abrir el selector de archivos nativo
function triggerFileInput() {
  fileInput.value.click();
}

// Manejar selección mediante el input
function handleFileSelect(event) {
  const file = event.target.files[0];
  processFile(file);
}

// Eventos de Drag & Drop
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

// Validar y asignar el archivo
function processFile(file) {
  if (!file) return;
  
  // Solo aceptar PDFs
  if (file.type !== "application/pdf") {
    alert("Si us plau, puja només arxius PDF.");
    return;
  }
  
  pdfFile.value = file;
}

// Eliminar archivo seleccionado
function removeFile() {
  pdfFile.value = null;
  if (fileInput.value) fileInput.value.value = ""; // Limpiar input
}

// ============================================
// FUNCIÓN: Extraer texto del PDF (OCR)
// ============================================
// Usa pdf.js para leer el contenido textual de cada página
// Devuelve todo el texto concatenado para enviarlo a la IA
async function extractTextFromPdf(file) {
  try {
    // PASO 1: Convertir archivo a ArrayBuffer (formato que entiende pdf.js)
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const doc = await loadingTask.promise;
    
    let fullText = "";
    
    // PASO 2: Iterar todas las páginas del PDF
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      // Extraer solo el texto de cada elemento
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n";
    }
    
    return fullText; // Texto completo del PDF
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("No s'ha pogut llegir el text del PDF.");
  }
}

// ============================================
// ANÁLISIS CON IA (Llamado desde el componente padre)
// ============================================
async function triggerAnalysis(studentNameForContext) {
  // Verificar que hay un archivo seleccionado
  if (!pdfFile.value) {
    alert("Atenció: No has seleccionat cap fitxer PDF per analitzar.");
    errorMsg.value = "Si us plau, selecciona un arxiu PDF abans de continuar.";
    return null;
  }

  isProcessing.value = true;
  statusMessage.value = "Llegint document...";
  errorMsg.value = "";

  try {
    // Extraer texto del PDF
    const text = await extractTextFromPdf(pdfFile.value);

    if (!text || text.trim().length < 10) {
      throw new Error("El PDF sembla buit.");
    }

    statusMessage.value = `Analitzant dades per a: ${studentNameForContext}...`;

    await analyzePdfContent(text, studentNameForContext);

    if (aiError.value) throw new Error(aiError.value);

    statusMessage.value = "Anàlisi completada.";
    return aiResponse.value;
  } catch (err) {
    console.error(err);
    errorMsg.value = err.message;
    return null;
  } finally {
    isProcessing.value = false;
  }
}

// ---------------------------------------------------------
// --- NUEVA FUNCION: ENVIAR AL BACKEND (Express/Multer) ---
// ---------------------------------------------------------
const uploadPdfAndSaveData = async (studentRalc, aiData) => {
  if (!pdfFile.value) {
    throw new Error("No s'ha trobat l'arxiu PDF per pujar.");
  }

  // OBTENER DATOS DEL USUARIO LOGUEADO (profesor o centro)
  let professorId = null;
  let professorEmail = null;
  const userCentre = localStorage.getItem('user_centre');
  if (userCentre) {
    const centreData = JSON.parse(userCentre);
    professorEmail = centreData.email; // Email del profesor/centro
    // Si es profesor, podemos buscar su ID en el backend o enviarlo si lo tenemos
    // Por ahora enviamos el email que es único
  }

  // 1. Creamos un FormData para enviar archivo binario + texto
  const formData = new FormData();

  // Datos obligatorios - IMPORTANTE: Añadir antes del archivo para que Multer pueda leerlo en el filename
  formData.append("ralc", studentRalc);
  formData.append("professor_email", professorEmail || ""); // AGREGAMOS EL EMAIL DEL PROFESOR

  // 'pdfFile' debe coincidir con upload.single('pdfFile') en tu backend
  formData.append("pdfFile", pdfFile.value);

  // Datos de la IA (Verificamos que existan)
  if (aiData) {
    formData.append("dificultat", aiData.dificultat || "");
    formData.append("gravetat", aiData.gravetat || "");
    formData.append("justificacio", aiData.justificacio || "");
    formData.append("proposta", aiData.proposta_educativa || ""); // Ojo: en BD es proposta_educativa
    formData.append("observacio", aiData.observacio || "");
  }

  try {
    // Ajusta la URL a tu backend (http://localhost:3000/api/save-pi)
    // Si tienes configurado un proxy en nuxt.config, usa solo "/api/save-pi"
    const response = await fetch("/api/save-pi", { //dev
    //const response = await fetch("http://edupi.daw.inspedralbes.cat/api/save-pi", { //prod
      method: "POST",
      body: formData,
      // IMPORTANTE: NO añadir headers de Content-Type manuales.
      // El navegador lo gestiona automáticamente para multipart/form-data
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al guardar al servidor");
    }

    return await response.json(); // Devuelve { success: true, id: ..., path: ... }
  } catch (error) {
    console.error("Error upload:", error);
    throw error;
  }
};

defineExpose({
  triggerAnalysis,
  uploadPdfAndSaveData,
  pdfFile: ref(null),
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
      </div>
      <p class="drop-text">
        <span class="highlight">Fes clic per pujar</span> o arrossega el PDF
        aquí
      </p>
      <p class="drop-subtext">Màxim 10MB (PDF)</p>
    </div>

    <div v-else class="file-preview">
      <div class="file-info">
        <div class="file-icon">📄</div>
        <div class="file-details">
          <p class="file-name">{{ pdfFile.name }}</p>
          <p class="file-size">
            {{ (pdfFile.size / 1024 / 1024).toFixed(2) }} MB
          </p>
        </div>
      </div>
      <button @click="removeFile" class="btn-remove" title="Eliminar arxiu">
        ✕
      </button>
    </div>

    <!-- Feedback messages -->
    <div v-if="statusMessage" class="status-msg">
      <span v-if="isProcessing" class="spinner"></span>
      {{ statusMessage }}
    </div>
    <div v-if="errorMsg" class="error-msg">
      ⚠️ {{ errorMsg }}
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

.status-msg {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f9ff;
  color: #0369a1;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-msg {
  margin-top: 15px;
  padding: 10px;
  background-color: #fef2f2;
  color: #b91c1c;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #0369a1;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}
</style>
