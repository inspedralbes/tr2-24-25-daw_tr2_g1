<script setup>
// ============================================
// PÁGINA: Crear Nuevo PI (Flujo Completo)
// ============================================
// Combina registro de alumno + subida de PDF + análisis IA + guardado
// Proceso de 2 pasos: 1) Datos y Documentación, 2) Análisis y Revisión
import { ref } from "vue";
import RegisterStudent from "../../components/comp-pi/RegisterStudent.vue";
import FileUpload from "../../components/comp-pi/FileUpload.vue";
import ReviewFileResponse from "../../components/comp-pi/ReviewFileResponse.vue";

// ============================================
// REFERENCIAS Y ESTADO
// ============================================
const registerStudentRef = ref(null);  // Referencia al componente de registro
const fileUploadRef = ref(null);       // Referencia al componente de subida PDF

const step = ref(1);                   // Paso actual (1 o 2)
const isGlobalLoading = ref(false);    // Bloqueo global durante operaciones asíncronas

const piAnalysisData = ref(null);      // Respuesta de Gemini AI
const studentData = ref(null);         // Datos del alumno recién creado

// ============================================
// FUNCIÓN: Guardar Alumno y Analizar PDF (PASO 1)
// ============================================
// Combina dos operaciones:
// 1. Crear alumno en BD
// 2. Analizar el PDF con IA
async function handleSaveAndAnalyze() {
  if (isGlobalLoading.value) return;
  isGlobalLoading.value = true;

  try {
    // PASO 1: Guardar alumno en base de datos
    console.log("Paso 1: Guardando alumno...");
    const studentResult = await registerStudentRef.value.submitStudentForm();

    // VALIDACIÓN: Verificar que el alumno se guardó correctamente
    if (!studentResult || !studentResult.success) {
      return;
    }

    studentData.value = studentResult.data;
    console.log("Alumno guardado:", studentData.value);

    // PASO 2: Analizar PDF con IA
    console.log("Paso 2: Analizando PDF...");
    const studentFullName = `${studentData.value.name} ${studentData.value.surname}`;

    const analysisResult =
      await fileUploadRef.value.triggerAnalysis(studentFullName);
    
    // VALIDACIÓN: Verificar que el análisis fue exitoso
    if (!analysisResult) {
      console.warn(
        "El análisis devolvió null (probablemente falta archivo o error IA)",
      );
      return;
    }

    // PASO 3: Pasar a la pantalla de revisión
    piAnalysisData.value = analysisResult;
    step.value = 2;
  } catch (error) {
    console.error("Error crítico:", error);
    alert("Hi ha hagut un error inesperat: " + error.message);
  } finally {
    isGlobalLoading.value = false;
  }
}

// ============================================
// FUNCIÓN: Guardar PI Revisado (PASO 2)
// ============================================
// Sube el PDF al servidor y guarda el PI en BD con datos revisados
async function handleFinalSave(reviewedFormData) {
  isGlobalLoading.value = true;
  try {
     const ralc = studentData.value.ralc;
     
     // PASO 1: Subir PDF y guardar PI en BD
     // Llama al componente FileUpload que maneja Multer + inserción
     const result = await fileUploadRef.value.uploadPdfAndSaveData(ralc, reviewedFormData);
     
     console.log("Upload result:", result);
     
     // PASO 2: Redirigir al home tras guardado exitoso
     await navigateTo(`/home`); 
  } catch (err) {
      console.error("Error saving final PI:", err);
      alert("Error al guardar: " + err.message);
  } finally {
      isGlobalLoading.value = false;
  }
}
</script>

<template>
  <div class="page-container">
    <div class="steps-container">
      <div class="step-item" :class="{ active: step >= 1 }">
        <div class="step-circle">1</div>
        <span class="step-label">Dades i Documentació</span>
      </div>
      <div class="step-line"></div>
      <div class="step-item" :class="{ active: step === 2 }">
        <div class="step-circle">2</div>
        <span class="step-label">Anàlisi i Revisió</span>
      </div>
    </div>

    <hr />
    
    <div class="content-card fade-in">
      <div v-show="step === 1">
        <RegisterStudent ref="registerStudentRef" />
        <div class="divider"></div>
        <div class="section-block">
          <h2 class="section-title">Documentació PDF</h2>
          <p class="section-desc">Puja el PI o informes previs per analitzar amb IA.</p>
          <FileUpload ref="fileUploadRef" />
        </div>

        <div class="action-bar">
          <button
            @click="handleSaveAndAnalyze"
            class="btn-master"
            :class="{ 'btn-loading': isGlobalLoading }"
            :disabled="isGlobalLoading"
          >
            <span v-if="isGlobalLoading" class="loader"></span>
            <span v-else>Guardar i Analitzar amb IA</span>
          </button>
        </div>
      </div>

      <div v-show="step === 2">
        <ReviewFileResponse
          v-if="step === 2"
          :student="studentData"
          :aiData="piAnalysisData"
          :fileName="fileUploadRef?.pdfFile?.name"
          @back="step = 1"
          @save="handleFinalSave"
        />
      </div>
    </div> <!-- Tanca content-card -->
  </div> <!-- Tanca page-container -->
</template>

<style scoped>
/* --- LAYOUT PRINCIPAL --- */
.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

/* --- INDICADOR DE PASOS MEJORADO --- */
.steps-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.5;
  transition: all 0.3s;
}

.step-item.active {
  opacity: 1;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #eee;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid #ddd;
}

.active .step-circle {
  background-color: #d9001d; /* Rojo Gencat */
  color: white;
  border-color: #d9001d;
}

.step-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #ddd;
  margin: 0 20px;
  max-width: 100px;
}

/* --- TARJETA DE CONTENIDO --- */
.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  padding: 40px;
  border: 1px solid #eef0f5;
}

.section-block {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.25rem;
  color: #d9001d;
  margin-bottom: 5px;
  font-weight: 700;
}

.section-desc {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 25px;
}

.divider {
  height: 1px;
  background-color: #eef0f5;
  margin: 40px 0;
}

/* --- BOTÓN PRINCIPAL --- */
.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}

.btn-master {
  background-color: #d9001d;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(217, 0, 29, 0.2);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-master:hover:not(:disabled) {
  background-color: #b00018;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(217, 0, 29, 0.3);
}

.btn-master:disabled {
  background-color: #fabec5;
  cursor: not-allowed;
  transform: none;
}

/* --- ESTILOS PROFUNDOS (Para arreglar los componentes hijos feos) --- */
/* Usamos :deep() para afectar a RegisterStudent y FileUpload sin tocar sus archivos */

:deep(input[type="text"]),
:deep(input[type="date"]),
:deep(input[type="number"]),
:deep(select) {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #dce1e6;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  background-color: #fcfcfc;
}

:deep(input:focus),
:deep(select:focus) {
  outline: none;
  border-color: #d9001d;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(217, 0, 29, 0.05);
}

:deep(label) {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: #444;
  margin-bottom: 6px;
}

/* Animación simple */
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Spinner pequeño */
.loader {
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
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