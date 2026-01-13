<script setup lang="ts">
import { ref } from "vue";

// Dynamic import for pdfjs
const getPdfWorker = async () => {
  if (process.client) {
    const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    return worker.default;
  }
  return null;
};

// -- STATE --
const step = ref(1);
const studentData = ref({
  nom: "",
  cognoms: "",
  ralc: "",
  dni: "",
  dataNaixement: "",
  curs: "",
  grup: "",
});
const pdfFile = ref<File | null>(null);
const extractedText = ref("");

// -- COMPOSABLES --
const {
  analyzePdfContent,
  aiResponse,
  isGenerating,
  error: aiError,
} = useGemini();

// -- ACTIONS --
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    pdfFile.value = target.files[0];
  }
};

const extractTextFromPdf = async (file: File): Promise<string> => {
  if (!process.client) return "";

  try {
    const pdfjsLib = await import("pdfjs-dist");
    const workerUrl = await getPdfWorker();

    if (workerUrl) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        // @ts-expect-error item structure varies
        .map((item: any) => item.str || "")
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText || "No text could be extracted.";
  } catch (e: any) {
    console.error("Error reading PDF:", e);
    if (e.name === "MissingPDFException") {
      throw new Error("L'arxiu PDF no és vàlid o està corrupte.");
    }
    throw new Error("Error tècnic llegint el PDF: " + (e.message || e));
  }
};

const nextStep = async () => {
  if (step.value === 1) {
    // Validate
    if (!studentData.value.nom || !studentData.value.cognoms) {
      alert("Per favor omple el nom i cognoms.");
      return;
    }

    if (pdfFile.value) {
      try {
        // 1. Extract Text
        extractedText.value = await extractTextFromPdf(pdfFile.value);

        // 2. Analyze with AI
        if (extractedText.value.trim().length > 0) {
          const fullName = `${studentData.value.nom} ${studentData.value.cognoms}`;
          await analyzePdfContent(extractedText.value, fullName);
        }

        // 3. Move to Step 2
        step.value = 2;
      } catch (e) {
        alert("Error: " + e);
        console.error(e);
      }
    } else {
      // Continue without PDF
      step.value = 2;
    }
  }
};

const savePlan = () => {
  // Save logic here (e.g. call API)
  alert("Pla guardat correctament! (Simulació)");
  // navigateTo('/dashboard');
};
</script>

<template>
  <div class="main-content">
    <div class="container">
      <div class="page-header">
        <h1 v-if="step === 1">Crear Nou PI</h1>
        <h1 v-else>Revisió del Pla</h1>

        <p v-if="step === 1">Introdueix les dades i puja els informes previs</p>
        <p v-else>Revisa i edita la proposta generada per la IA</p>
      </div>

      <div class="steps-indicator">
        <span :class="{ active: step === 1 }">1. Dades i Documentació</span>
        <span class="separator">/</span>
        <span :class="{ active: step === 2 }">2. Anàlisi i Resultat</span>
      </div>

      <div class="form-card">
        <div v-if="step === 1">
          <div class="form-section">
            <h2>Dades de l'Alumne</h2>
            <div class="student-form-wrapper">
              <FormStudent v-model="studentData" />
            </div>
          </div>

          <div class="form-section">
            <h2>Informes Previs</h2>
            <p class="description">
              Puja l'informe psicopedagògic o PI anterior (PDF). La IA
              analitzarà el contingut per pre-omplir el nou pla.
            </p>

            <div class="upload-wrapper" :class="{ 'has-file': pdfFile }">
              <div class="upload-content">
                <svg
                  class="upload-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>

                <div v-if="!pdfFile">
                  <label for="file-upload" class="upload-label"
                    >Selecciona un arxiu</label
                  >
                  <span class="upload-text">o arrossega'l aquí</span>
                </div>
                <div v-else>
                  <p class="file-name">{{ pdfFile.name }}</p>
                  <button @click="pdfFile = null" class="btn-text">
                    Canviar arxiu
                  </button>
                </div>

                <input
                  id="file-upload"
                  type="file"
                  accept="application/pdf"
                  @change="handleFileChange"
                  class="hidden-input"
                />
              </div>
            </div>
          </div>

          <div v-if="isGenerating" class="loading-state">
            <div class="spinner"></div>
            <p>Analitzant document i generant propostes...</p>
          </div>

          <div v-if="aiError" class="error-msg">
            {{ aiError }}
          </div>

          <div class="form-actions">
            <button class="btn-cancel">Cancel·lar</button>
            <button
              @click="nextStep"
              class="btn-primary"
              :disabled="isGenerating"
            >
              {{ pdfFile ? "Analitzar i Continuar" : "Continuar sense IA" }}
            </button>
          </div>
        </div>

        <div v-else-if="step === 2">
          <div class="form-section">
            <h2>Contingut del Pla</h2>

            <div v-if="aiResponse" class="success-banner">
              <svg
                class="icon-check"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span
                >Contingut generat correctament per la IA. Si us plau,
                revisa-ho.</span
              >
            </div>

            <p class="description">
              Edita el text a continuació abans de guardar el document final.
            </p>

            <textarea
              v-model="aiResponse"
              class="editor-textarea"
              placeholder="Aquí apareixerà el contingut generat..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button @click="step = 1" class="btn-cancel">Enrere</button>
            <button @click="savePlan" class="btn-primary">Guardar PI</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ESTRUCTURA GENERAL */
.main-content {
  background-color: #f5f5f5;
  min-height: calc(100vh - 140px);
  padding: 40px 0;
  font-family: "Open Sans", sans-serif; /* Asegurando fuente */
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* HEADER */
.page-header {
  width: 100%;
}

.page-header h1 {
  font-weight: 700;
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.2;
}

.page-header p {
  color: #666;
  font-size: 18px;
  margin: 0;
}

/* STEPS INDICATOR */
.steps-indicator {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
}
.steps-indicator .active {
  color: #d00000; /* Rojo corporativo */
  font-weight: 600;
}
.steps-indicator .separator {
  margin: 0 10px;
}

/* CARD PRINCIPAL */
.form-card {
  background-color: white;
  border: 1px solid #ddd;
  border-top: 4px solid #d00000;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 40px;
  width: 100%;
  box-sizing: border-box;
}

/* SECCIONES INTERNAS */
.form-section {
  margin-bottom: 30px;
}

.form-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
  margin-top: 0;
}

.description {
  font-size: 15px;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.5;
}

/* UPLOAD WRAPPER */
.upload-wrapper {
  background-color: #fafafa;
  border: 2px dashed #ddd;
  border-radius: 6px;
  padding: 40px;
  text-align: center;
  transition: all 0.2s;
}

.upload-wrapper:hover {
  border-color: #bbb;
  background-color: #f0f0f0;
}

.upload-wrapper.has-file {
  background-color: #e6f7e6; /* Verde muy suave */
  border-color: #28a745;
  border-style: solid;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #999;
  margin-bottom: 15px;
  display: inline-block;
}

.upload-label {
  color: #d00000;
  font-weight: 600;
  cursor: pointer;
}
.upload-label:hover {
  text-decoration: underline;
}

.upload-text {
  color: #666;
  margin-left: 5px;
}

.hidden-input {
  display: none;
}

.file-name {
  font-size: 16px;
  font-weight: 600;
  color: #28a745;
  margin: 0 0 10px 0;
}

.btn-text {
  background: none;
  border: none;
  color: #666;
  text-decoration: underline;
  cursor: pointer;
  font-size: 13px;
}

/* TEXT AREA EDITOR */
.editor-textarea {
  width: 100%;
  min-height: 400px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace; /* Monospaced para edición */
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  box-sizing: border-box;
}

.editor-textarea:focus {
  outline: none;
  border-color: #d00000;
}

/* MENSAJES DE ESTADO */
.success-banner {
  background-color: #f0fff4;
  border: 1px solid #c6f6d5;
  color: #2f855a;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.icon-check {
  width: 20px;
  height: 20px;
}

.error-msg {
  color: #c53030;
  background-color: #fff5f5;
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
  text-align: center;
}

.loading-state {
  text-align: center;
  padding: 20px;
  color: #d00000;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d00000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* BOTONES */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-cancel {
  text-decoration: none;
  color: #555;
  font-size: 14px;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #f0f0f0;
  color: #333;
  border-color: #bbb;
}

.btn-primary {
  background-color: #d00000;
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 25px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #b00000;
}

.btn-primary:disabled {
  background-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}
</style>
