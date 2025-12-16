<script setup>
import { ref } from "vue";

// Importamos lo necesario del composable
import { useGemini } from "../composables/useGemeni";

// Instanciamos el composable
// Renombramos 'error' a 'aiError' para que no choque con el error del PDF
const {
  analyzePdfContent,
  aiResponse,
  isGenerating,
  error: aiError,
} = useGemini();

const extractedText = ref("");
const isLoading = ref(false);
const pdfError = ref(null);
const copySuccess = ref(false);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) return;
  if (file.type !== "application/pdf") {
    pdfError.value = "Por favor, sube un archivo válido (.pdf)";
    return;
  }

  pdfError.value = null;
  extractedText.value = "";
  isLoading.value = true;
  copySuccess.value = false;

  try {
    const pdfjsLib = await import("pdfjs-dist");
    const pdfWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += `--- Página ${i} ---\n${pageText}\n\n`;
    }

    extractedText.value = fullText;
  } catch (err) {
    console.error("Error detallado:", err);
    pdfError.value = "Error al leer el PDF. Puede estar dañado o protegido.";
  } finally {
    isLoading.value = false;
  }
};

const copyToClipboard = async () => {
  if (!extractedText.value) return;

  try {
    await navigator.clipboard.writeText(extractedText.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error("Error al copiar: ", err);
    alert("No se pudo copiar el texto automáticamente.");
  }
};
</script>

<template>
  <div>
    <p>Sube un archivo PDF para extraer su contenido.</p>
    <div>
      <input
        type="file"
        accept="application/pdf"
        @change="handleFileUpload"
        class="file-input"
      />
    </div>

    <p v-if="pdfError" class="error-msg">{{ pdfError }}</p>

    <p v-if="isLoading" class="loading-text">
      Procesando PDF, por favor espera...
    </p>

    <div v-if="extractedText" class="result-section">
      <div class="result-header">
        <h3>Texto Extraído:</h3>
        <button
          @click="copyToClipboard"
          class="btn-copy"
          :class="{ 'btn-success': copySuccess }"
        >
          {{ copySuccess ? "¡Copiado!" : "Copiar Texto" }}
        </button>
      </div>

      <textarea readonly v-model="extractedText" class="text-window"></textarea>
    </div>

    <div class="actions">
      <button
        @click="analyzePdfContent(extractedText)"
        :disabled="isGenerating || !extractedText"
        class="btn btn-info text-white"
        style="margin-bottom: 20px"
      >
        {{ isGenerating ? "Pensando..." : "Analizar PDF con IA" }}
      </button>

      <div
        v-if="aiResponse"
        class="mt-4 p-4 border rounded bg-light"
        style="text-align: left; margin-bottom: 20px"
      >
        <h4>Resultado del Análisis:</h4>
        <p style="white-space: pre-wrap">{{ aiResponse }}</p>
      </div>

      <p v-if="aiError" class="text-danger mt-2">{{ aiError }}</p>

      <div>
        <NuxtLink to="/">
          <button class="btn-back">Volver a Inicio</button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
