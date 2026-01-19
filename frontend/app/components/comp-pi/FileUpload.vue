<script setup>
import * as pdfjsLib from "pdfjs-dist";

// -- PROPS & EMITS --
const props = defineProps({
  studentName: {
    type: String,
    default: "Alumne Desconegut",
  },
});

// -- STATE --
const pdfFile = ref(null);
const isProcessing = ref(false);
const errorMsg = ref("");
const statusMessage = ref("");
const { analyzePdfContent, aiResponse, error: aiError } = useGemini();

// -- WORKER SETUP --
const getPdfWorker = async () => {
  if (import.meta.env.SSR) return null;
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  return worker.default;
};

// -- LOGICA PDF --
const extractTextFromPdf = async (file) => {
  try {
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
        .map((item) => item.str || "")
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText || "";
  } catch (e) {
    console.error("Error PDF:", e);
    throw new Error(
      "No s'ha pogut llegir el PDF. Verifica que no estigui corrupte.",
    );
  }
};

// -- HANDLER (THIS WAS MISSING) --
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    pdfFile.value = file;
    errorMsg.value = "";
  }
};

// -- EXPOSED FUNCTION --
async function triggerAnalysis(studentNameForContext) {
  if (!pdfFile.value) {
    // Alert user visually
    alert("Atenció: No has seleccionat cap fitxer PDF per analitzar.");
    errorMsg.value = "Si us plau, selecciona un arxiu PDF abans de continuar.";
    return null;
  }

  isProcessing.value = true;
  statusMessage.value = "Llegint document...";
  errorMsg.value = "";

  try {
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

defineExpose({
  triggerAnalysis,
});
</script>

<template>
  <div class="file-upload-container">
    <h3>Informes Previs</h3>

    <div
      class="upload-wrapper"
      :class="{ 'has-file': pdfFile, 'is-loading': isProcessing }"
    >
      <div class="icon-area">
        <div v-if="isProcessing" class="spinner"></div>
        <svg
          v-else
          class="upload-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
      </div>

      <div class="content-area">
        <p v-if="isProcessing" class="status-text">{{ statusMessage }}</p>

        <div v-else-if="pdfFile">
          <p class="file-name">{{ pdfFile.name }}</p>
          <button @click="pdfFile = null" class="btn-text">
            Canviar arxiu
          </button>
        </div>

        <div v-else>
          <label for="file-upload" class="upload-label"
            >Selecciona un PDF</label
          >
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

    <div v-if="errorMsg" class="error-box">{{ errorMsg }}</div>
  </div>
</template>

<style scoped>
.file-upload-container {
  margin-top: 20px;
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 5px;
  font-size: 1.1em;
  color: #333;
}

.helper-text {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 15px;
}

.upload-wrapper {
  border: 2px dashed #ddd;
  border-radius: 6px;
  padding: 30px;
  text-align: center;
  background-color: #fafafa;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.upload-wrapper:hover {
  border-color: #999;
  background-color: #f0f0f0;
}

.upload-wrapper.has-file {
  background-color: #e6f7e6;
  border-color: #28a745;
  border-style: solid;
}

.upload-wrapper.is-loading {
  background-color: #fff9e6;
  border-color: #ffc107;
  border-style: solid;
  pointer-events: none; /* Bloquear clicks mientras carga */
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #999;
}

/* Spinner Styles */
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d00000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.upload-label {
  background-color: #d00000;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  display: inline-block;
  transition: background 0.2s;
}

.upload-label:hover {
  background-color: #b00000;
}

.hidden-input {
  display: none;
}

.file-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.status-text {
  color: #d00000;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.btn-primary-small {
  background-color: #28a745; /* Verde para acción positiva */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary-small:hover {
  background-color: #218838;
}

.btn-text {
  background: none;
  border: none;
  text-decoration: underline;
  color: #666;
  cursor: pointer;
  font-size: 0.9em;
}

.error-box {
  margin-top: 10px;
  padding: 10px;
  background-color: #ffe6e6;
  color: #d00000;
  border: 1px solid #ffcccc;
  border-radius: 4px;
  font-size: 0.9em;
  text-align: center;
}
</style>
