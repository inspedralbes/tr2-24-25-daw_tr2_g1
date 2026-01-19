<script setup>
import { ref, defineProps, defineEmits } from "vue";
// Asumo que tienes este composable basado en tu borrador anterior
import { useGemini } from "@/composables/useGemini";
// Importamos PDF.js dinámicamente
import * as pdfjsLib from "pdfjs-dist";

// -- PROPS & EMITS --
const props = defineProps({
  studentName: {
    type: String,
    default: "Alumne Desconegut",
  },
});

const emit = defineEmits(["analysis-complete", "error"]);

// -- STATE --
const pdfFile = ref(null);
const isProcessing = ref(false);
const errorMsg = ref("");
const statusMessage = ref("");

// Composable de IA
const { analyzePdfContent, aiResponse, error: aiError } = useGemini();

// -- WORKER SETUP (Necesario para Vite/Vue 3) --
const getPdfWorker = async () => {
  if (import.meta.env.SSR) return null; // Evitar en servidor
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
    const totalPages = pdf.numPages;

    // Leemos página a página
    for (let i = 1; i <= totalPages; i++) {
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

// -- HANDLERS --
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Reset
  pdfFile.value = file;
  errorMsg.value = "";
  isProcessing.value = false;
};

const processFile = async () => {
  if (!pdfFile.value) return;

  isProcessing.value = true;
  statusMessage.value = "Extraient text del document...";

  try {
    // 1. Extraer Texto
    const text = await extractTextFromPdf(pdfFile.value);

    if (!text || text.trim().length < 10) {
      throw new Error(
        "El PDF sembla buit o és una imatge sense text seleccionable.",
      );
    }

    // 2. Analizar con IA
    statusMessage.value = "Generant proposta amb Intel·ligència Artificial...";

    // Llamamos al composable pasando el texto y el nombre del alumno (prop)
    await analyzePdfContent(text, props.studentName);

    if (aiError.value) {
      throw new Error(aiError.value);
    }

    // 3. Emitir resultados al padre
    if (aiResponse.value) {
      statusMessage.value = "Anàlisi completada!";
      emit("analysis-complete", aiResponse.value);
    } else {
      throw new Error("La IA no ha retornat resultats vàlids.");
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = err.message || "Error desconegut processant l'arxiu.";
    emit("error", errorMsg.value);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="file-upload-container">
    <h3>Informes Previs</h3>
    <p class="helper-text">
      Puja l'informe psicopedagògic o PI anterior (PDF). El sistema analitzarà
      el contingut per omplir automàticament el pla.
    </p>

    <div
      class="upload-wrapper"
      :class="{ 'has-file': pdfFile, 'is-loading': isProcessing }"
    >
      <div class="icon-area">
        <svg
          v-if="!isProcessing"
          class="upload-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <div v-else class="spinner"></div>
      </div>

      <div class="content-area">
        <div v-if="isProcessing">
          <p class="status-text">{{ statusMessage }}</p>
        </div>

        <div v-else-if="pdfFile">
          <p class="file-name">{{ pdfFile.name }}</p>
          <div class="actions">
            <button @click="processFile" class="btn-primary-small">
              Analitzar Document
            </button>
            <button @click="pdfFile = null" class="btn-text">
              Canviar arxiu
            </button>
          </div>
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

    <div v-if="errorMsg" class="error-box">
      {{ errorMsg }}
    </div>
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
