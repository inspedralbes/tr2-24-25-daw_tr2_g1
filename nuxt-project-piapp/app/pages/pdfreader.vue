<script setup>
import { ref } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const extractedText = ref("");
const isLoading = ref(false);
const error = ref(null);
const copySuccess = ref(false);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) return;
  if (file.type !== "application/pdf") {
    error.value = "Por favor, sube un archivo válido (.pdf)";
    return;
  }

  error.value = null;
  extractedText.value = "";
  isLoading.value = true;
  copySuccess.value = false;

  try {
    const arrayBuffer = await file.arrayBuffer();

    // Cargar el documento
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;

    let fullText = "";

    // Iterar páginas
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Extraer strings y unir
      const pageText = textContent.items.map((item) => item.str).join(" ");

      fullText += `--- Página ${i} ---\n${pageText}\n\n`;
    }

    extractedText.value = fullText;
  } catch (err) {
    console.error("Error detallado:", err);
    error.value = "Error al leer el PDF. Puede estar dañado o protegido.";
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

    <p v-if="error" class="error-msg">{{ error }}</p>

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
      <NuxtLink to="/">
        <button class="btn-back">Volver a Inicio</button>
      </NuxtLink>
    </div>
  </div>
</template>
