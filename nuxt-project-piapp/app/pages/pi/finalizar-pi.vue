<script setup lang="ts">
import { jsPDF } from "jspdf";
import { usePiData } from "@/composables/usePiData";

const { piData } = usePiData();
const loading = ref(false);

const generatePDF = () => {
  // Check if we have at least one field (or student name) to generate
  // It's possible to have some empty, but usually at least one should be there.
  if (!piData.value.studentName) {
      alert("Falta el nom de l'alumne.");
      return;
  }

  loading.value = true;

  try {
    const doc = new jsPDF();

    // Config
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    let currentY = margin;

    // Helper: Add Header
    const addHeader = (isFirstPage = false) => {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("Pla Individualitzat (PI)", pageWidth - margin, 15, {
        align: "right",
      });
      doc.setTextColor(0); // Reset color

      if (isFirstPage) {
        currentY = 40;
      } else {
        currentY = 30;
      }
    };

    // Helper: Add Footer (Page Numbers)
    const addFooter = () => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Pàgina ${i} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }
    };
    
    // Helper: Print Section
    const printSection = (title: string, content: string) => {
        if (!content) return;
        
        // Check space for title
        if (currentY + 20 > pageHeight - margin) {
            doc.addPage();
            addHeader(false);
        }
        
        // Title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(208, 0, 0);
        doc.text(title, margin, currentY);
        currentY += 10;
        
        // Content
        doc.setFontSize(12);
        doc.setFont("times", "roman");
        doc.setTextColor(0);
        
        const splitText = doc.splitTextToSize(content, maxLineWidth);
        
        for (let i = 0; i < splitText.length; i++) {
            if (currentY + lineHeight > pageHeight - margin) {
                doc.addPage();
                addHeader(false);
                // Re-set font after new page
                doc.setFontSize(12);
                doc.setFont("times", "roman");
            }
            doc.text(splitText[i], margin, currentY);
            currentY += lineHeight;
        }
        
        currentY += 10; // Spacing after section
    };

    // --- PAGE 1 CONTENT ---

    // Title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(208, 0, 0); // Corporate Red
    doc.text("Pla Individualitzat", margin, currentY);
    currentY += 15;

    // Student Info
    if (piData.value.studentName) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont("helvetica", "normal");
      doc.text(`Alumne: ${piData.value.studentName}`, margin, currentY);
      doc.text(
        `RALC: ${piData.value.ralc || "N/A"}`,
        pageWidth - margin,
        currentY,
        { align: "right" }
      );
      doc.text(
        `DNI: ${piData.value.dni || "N/A"}`,
        margin,
        currentY + lineHeight
      );
      doc.text(
        `Data de Naixement: ${piData.value.birthDate || "N/A"}`,
        pageWidth - margin,
        currentY + lineHeight,
        { align: "right" }
      );
      doc.text(
        `Curs: ${piData.value.grade || "N/A"}`,
        margin,
        currentY + lineHeight * 2
      );
      doc.text(
        `Grup: ${piData.value.group || "N/A"}`,
        pageWidth - margin,
        currentY + lineHeight * 2,
        { align: "right" }
      );
      currentY += 20;
    }

    // Line separator
    doc.setDrawColor(200);
    doc.line(margin, currentY - 10, pageWidth - margin, currentY - 10);

    // Content Body (Sections)
    printSection("1. Dificultat i Gravetat", piData.value.dificultat_gravetat);
    printSection("2. Justificació del PI", piData.value.justificacio_pi);
    printSection("3. Proposta Educativa", piData.value.proposta_educativa);
    printSection("4. Observacions", piData.value.observacions);

    // Add footer to all pages
    addFooter();

    // Save
    let safeName = (piData.value.studentName || "download").replace(
      /[^a-z0-9]/iy,
      "_"
    );
    if (!safeName.toLowerCase().endsWith(".pdf")) {
      safeName += ".pdf";
    }
    console.log("Saving PDF as:", safeName);
    doc.save(safeName);
  } catch (error) {
    console.error("Error generant PDF:", error);
    alert(
      "Hi ha hagut un error generant el PDF. Revisa la consola per més detalls."
    );
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // If no data, maybe redirect back?
  if (!piData.value.studentName) {
    // Optional: navigateTo('/pi/crear-pi');
  }
});
</script>

<template>
  <div class="main-content">
    <div class="container">
      <div class="success-card">
        <div class="icon-wrapper">
          <svg
            class="check-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1>PI Creat Correctament!</h1>
        <p>El Pla Individualitzat s'ha guardat amb èxit.</p>

        <div class="actions">
          <button @click="generatePDF" class="btn-download" :disabled="loading">
            {{ loading ? "Generant..." : "Descarregar PDF" }}
          </button>

          <NuxtLink to="/" class="btn-home"> Tornar a l'inici </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  background-color: #f5f5f5;
  min-height: calc(100vh - 140px);
  padding: 60px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  max-width: 600px;
  width: 100%;
  padding: 0 20px;
}

.success-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 50px;
  text-align: center;
}

.icon-wrapper {
  background-color: #f0fff4;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px auto;
}

.check-icon {
  width: 40px;
  height: 40px;
  color: #2f855a;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

p {
  color: #666;
  margin-bottom: 40px;
  font-size: 18px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn-download {
  background-color: #d00000;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.btn-download:hover {
  background-color: #b00000;
}

.btn-download:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-home {
  display: inline-block;
  color: #666;
  text-decoration: none;
  padding: 15px 30px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.btn-home:hover {
  background-color: #f9f9f9;
  border-color: #ccc;
  color: #333;
}
</style>
