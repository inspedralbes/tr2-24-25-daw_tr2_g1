<script setup>
import { ref } from "vue";
import RegisterStudent from "../../components/comp-pi/RegisterStudent.vue";
import FileUpload from "../../components/comp-pi/FileUpload.vue";
import ReviewFileResponse from "../../components/comp-pi/ReviewFileResponse.vue";

// REFERENCIAS A LOS COMPONENTES HIJOS
const registerStudentRef = ref(null);
const fileUploadRef = ref(null);

// ESTADO GLOBAL
const step = ref(1);
const isGlobalLoading = ref(false);

// DATOS
const piAnalysisData = ref(null);
const studentData = ref(null);

// FUNCION PRINCIPAL
async function handleSaveAndAnalyze() {
  if (isGlobalLoading.value) return;
  isGlobalLoading.value = true;

  try {
    // GUARDAR ALUMNO
    console.log("Paso 1: Guardando alumno...");
    const studentResult = await registerStudentRef.value.submitStudentForm();

    if (!studentResult || !studentResult.success) {
      return;
    }

    studentData.value = studentResult.data;
    console.log("Alumno guardado:", studentData.value);

    // ANALIZAR PDF
    console.log("Paso 2: Analizando PDF...");
    const studentFullName = `${studentData.value.name} ${studentData.value.surname}`;

    const analysisResult =
      await fileUploadRef.value.triggerAnalysis(studentFullName);
    if (!analysisResult) {
      console.warn(
        "El análisis devolvió null (probablemente falta archivo o error IA)",
      );
      return;
    }

    piAnalysisData.value = analysisResult;
    step.value = 2;
  } catch (error) {
    console.error("Error crítico:", error);
    alert("Hi ha hagut un error inesperat: " + error.message);
  } finally {
    isGlobalLoading.value = false;
  }
}

// NUEVA FUNCIÓN FINAL
async function handleFinalSave(reviewedFormData) {
  isGlobalLoading.value = true;
  try {
     const ralc = studentData.value.ralc;
     // Llamamos al hijo para que suba el fichero + los datos revisados
     const result = await fileUploadRef.value.uploadPdfAndSaveData(ralc, reviewedFormData);
     
     console.log("Upload result:", result);
     
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
  <div class="steps-indicator">
    <span :class="{ active: step === 1 }">1. Dades i Documentació</span>
    <span class="separator">/</span>
    <span :class="{ active: step === 2 }">2. Anàlisi i Revisió</span>
  </div>

  <hr />

  <div v-show="step === 1">
    <RegisterStudent ref="registerStudentRef" />

    <br />

    <FileUpload ref="fileUploadRef" />

    <div class="action-bar">
      <button
        @click="handleSaveAndAnalyze"
        class="btn-master"
        :disabled="isGlobalLoading"
      >
        <span v-if="isGlobalLoading">Processant...</span>
        <span v-else>Guardar Alumne i Analitzar PDF</span>
      </button>
    </div>
  </div>

  <div v-if="step === 2">
    <ReviewFileResponse
      :student="studentData"
      :aiData="piAnalysisData"
      :fileName="fileUploadRef?.pdfFile?.name"
      @back="step = 1"
      @save="handleFinalSave"
    />
  </div>
</template>

<style scoped>
/* TUS ESTILOS (Estaban perfectos) */
.steps-indicator {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}
.steps-indicator .active {
  color: #d00000;
  font-weight: 600;
}
.steps-indicator .separator {
  margin: 0 10px;
}
</style>
