<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// Imports originales (respetando tus rutas y nombres)
import FileUpload from "../comp-pi/FileUpload.vue";
import ReviewFileResponse from "../comp-pi/ReviewFileResponse.vue";

const route = useRoute();
const router = useRouter();

// --- ESTADO ---
const ralc = route.query.ralc;
const student = ref(null);
const isLoadingStudent = ref(true);
const step = ref(1); // 1: Upload, 2: Review
const isGlobalLoading = ref(false);
const piAnalysisData = ref(null);

// Referencia al componente hijo (FileUpload)
const fileUploadRef = ref(null);

// --- CARGA DE DATOS ---

// Cargar alumno
const loadStudent = async () => {
  if (!ralc) {
    alert("Falta el RALC del alumne");
    router.push("/home");
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:3000/api/alumne/${ralc}`);
    const data = await response.json();
    
    if (data.success) {
      student.value = data.data;
    } else {
      throw new Error(data.error || "Alumne no trobat");
    }
  } catch (error) {
    console.error("Error carregant alumne:", error);
    alert("Error carregant dades de l'alumne.");
    router.push("/home");
  } finally {
    isLoadingStudent.value = false;
  }
};

// --- FLUJO ---

// Paso 1: Analizar PDF
const handleAnalyze = async () => {
    if (isGlobalLoading.value) return;
    isGlobalLoading.value = true;
    
    try {
        const studentFullName = student.value ? `${student.value.nom} ${student.value.cognoms}` : "Alumne";
        
        // Llamada al método expuesto en FileUpload
        const analysisResult = await fileUploadRef.value.triggerAnalysis(studentFullName);
        
        if (analysisResult) {
            piAnalysisData.value = analysisResult;
            step.value = 2;
        }
    } catch (error) {
        console.error(error);
        alert("Error durant l'anàlisi: " + error.message);
    } finally {
        isGlobalLoading.value = false;
    }
}

// Paso 2: Guardar definitivo
const handleFinalSave = async (reviewedFormData) => {
    isGlobalLoading.value = true;
    try {
        // Llamada al método de subida en FileUpload
        const result = await fileUploadRef.value.uploadPdfAndSaveData(ralc, reviewedFormData);
        console.log("PI Guardado:", result);
        
        // Redirigir al perfil
        router.push(`/student/${ralc}`);
    } catch (error) {
        console.error("Error guardando PI:", error);
        alert("Error al guardar: " + error.message);
    } finally {
        isGlobalLoading.value = false;
    }
}

onMounted(() => {
    loadStudent();
});
</script>

<template>
  <div class="page-container">
    
    <div class="header">
        <h1>Afegir Nou PI</h1>
        <p v-if="student" class="subtitle">
            Per a l'alumne: <strong>{{ student.nom }} {{ student.cognoms }}</strong> ({{ ralc }})
        </p>
    </div>

    <div class="steps-indicator">
        <span :class="{ active: step === 1 }">1. Pujar i Analitzar PDF</span>
        <span class="separator">/</span>
        <span :class="{ active: step === 2 }">2. Revisió i Guardat</span>
      </div>

    <div v-if="isLoadingStudent" class="loading">
        Carregant dades de l'alumne...
    </div>

    <div v-else class="content-wrapper">
        
        <div v-show="step === 1" class="step-content">
            <FileUpload 
                ref="fileUploadRef" 
                :studentName="student ? `${student.nom} ${student.cognoms}` : ''" 
            />
            
            <div class="actions">
                <button @click="router.go(-1)" class="btn-cancel">Cancel·lar</button>
                <button 
                    @click="handleAnalyze" 
                    class="btn-primary" 
                    :disabled="isGlobalLoading"
                >
                    <span v-if="isGlobalLoading">Analitzant...</span>
                    <span v-else>Analitzar Document</span>
                </button>
            </div>
        </div>

        <div v-if="step === 2" class="step-content">
            <ReviewFileResponse 
                :student="student"
                :aiData="piAnalysisData"
                :fileName="fileUploadRef?.pdfFile?.name"
                @back="step = 1"
                @save="handleFinalSave"
            />
        </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    min-height: 80vh;
}

.header {
    text-align: center;
    margin-bottom: 30px;
}

.header h1 {
    color: #333;
    margin-bottom: 10px;
}

.subtitle {
    color: #666;
    font-size: 1.1em;
}

/* Indicador Pasos */
.steps-indicator {
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.1em;
    color: #999;
}

.steps-indicator .active {
    color: #d00000;
    font-weight: bold;
}

.steps-indicator .separator { margin: 0 10px; }

/* Botones */
.actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
}

.btn-primary {
    background-color: #d00000;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-primary:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) { background-color: #b00000; }

.btn-cancel {
    background: none;
    border: 1px solid #ccc;
    padding: 12px 30px;
    border-radius: 6px;
    cursor: pointer;
    color: #555;
    transition: background 0.3s;
}

.btn-cancel:hover { background-color: #e0e0e0; }

.loading {
    text-align: center;
    padding: 50px;
    color: #666;
}
</style>