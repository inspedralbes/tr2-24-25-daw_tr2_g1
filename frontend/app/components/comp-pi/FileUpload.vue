<script setup>
import { ref } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import { useGemini } from "../../composables/useGemini";

// Configurar Worker PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Composables
const { analyzePdfContent, error: aiError, aiResponse } = useGemini();

// Estado
const statusMessage = ref("");
const errorMsg = ref("");
const isProcessing = ref(false);
const pdfFile = ref(null);
const isDragging = ref(false);
const fileInput = ref(null);

// --- 1. GESTIÓN DE ARCHIVOS ---

// Abrir selector
function triggerFileInput() {
  fileInput.value.click();
}

// Seleccionar archivo
function handleFileSelect(event) {
  const file = event.target.files[0];
  processFile(file);
}

// Eventos Drag & Drop
function onDragOver() { isDragging.value = true; }
function onDragLeave() { isDragging.value = false; }

function onDrop(event) {
  isDragging.value = false;
  processFile(event.dataTransfer.files[0]);
}

// Validar PDF
function processFile(file) {
  if (!file) return;
  if (file.type !== "application/pdf") {
    alert("Només arxius PDF.");
    return;
  }
  pdfFile.value = file;
  errorMsg.value = "";
}

// Eliminar archivo
function removeFile() {
  pdfFile.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

// --- 2. EXTRACCIÓN Y ANÁLISIS ---

// Extraer texto PDF
async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const doc = await loadingTask.promise;
    
    let fullText = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n";
    }
    return fullText;
  } catch (error) {
    console.error("Error PDF:", error);
    throw new Error("No es pot llegir el PDF.");
  }
}

// Iniciar análisis IA
async function triggerAnalysis(studentName) {
  if (!pdfFile.value) {
    errorMsg.value = "Selecciona un PDF primer.";
    return null;
  }

  isProcessing.value = true;
  statusMessage.value = "Llegint document...";
  errorMsg.value = "";

  try {
    const text = await extractTextFromPdf(pdfFile.value);

    if (!text || text.trim().length < 10) throw new Error("PDF buit o il·legible.");

    statusMessage.value = `Analitzant per a: ${studentName}...`;
    await analyzePdfContent(text, studentName);

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

// --- 3. GUARDAR EN BACKEND ---

// Subir PDF y Datos
const uploadPdfAndSaveData = async (studentRalc, aiData) => {
  if (!pdfFile.value) throw new Error("Falta arxiu PDF.");

  const formData = new FormData();
  
  // Datos obligatorios (Orden importante para Multer)
  formData.append("ralc", studentRalc);
  formData.append("pdfFile", pdfFile.value);

  // Datos IA (si existen)
  if (aiData) {
    formData.append("dificultat", aiData.dificultat || "");
    formData.append("gravetat", aiData.gravetat || "");
    formData.append("justificacio", aiData.justificacio || "");
    formData.append("proposta", aiData.proposta_educativa || "");
    formData.append("observacio", aiData.observacio || "");
  }

  try {
    // Petición al Backend
    const response = await fetch("http://localhost:3000/api/save-pi", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al servidor");
    }

    return await response.json();

  } catch (error) {
    console.error("Error upload:", error);
    throw error;
  }
};

// Exponer funciones
defineExpose({
  triggerAnalysis,
  uploadPdfAndSaveData,
  pdfFile
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
        <span class="highlight">Fes clic per pujar</span> o arrossega el PDF
      </p>
      <p class="drop-subtext">Max 10MB (PDF)</p>
    </div>

    <div v-else class="file-preview">
      <div class="file-info">
        <div class="file-icon">📄</div>
        <div class="file-details">
          <p class="file-name">{{ pdfFile.name }}</p>
          <p class="file-size">{{ (pdfFile.size / 1024 / 1024).toFixed(2) }} MB</p>
        </div>
      </div>
      <button @click="removeFile" class="btn-remove" title="Eliminar">✕</button>
    </div>

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
.upload-wrapper { width: 100%; }
.hidden-input { display: none; }

/* Drag Zone */
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
}

.drop-zone:hover {
  border-color: #d9001d;
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

.drop-zone:hover .icon-cloud { color: #d9001d; }

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

/* Preview */
.file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.file-icon { font-size: 2rem; }

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

/* Mensajes */
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

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>