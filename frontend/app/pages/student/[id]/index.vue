<script setup lang="ts">
interface ApiResponse {
  success: boolean
  data?: any
  error?: string
}

const route = useRoute();
const studentRalc = route.params.id;

// Estat de càrrega
const isLoading = ref(true);
const error = ref<string | null>(null);
const student = ref<any>(null);

// Estat per les pestanyes de previsualització
const activeTab = ref<'ia' | 'pdf'>('ia');

const changeTab = (tab: 'ia' | 'pdf') => {
  activeTab.value = tab;
};

// Carregar dades de l'alumne des de l'API
const loadStudent = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Cridar directament al endpoint de l'alumne per RALC
    const response = await $fetch<ApiResponse>(`http://localhost:3000/api/alumne/${studentRalc}`);

    console.log("Response completa:", response);

    if (response?.success && response.data) {
      student.value = response.data;
      console.log("Alumne trobat:", response.data);
    } else {
      error.value = response.error || "Error al carregar les dades";
      console.error("Format de resposta incorrecte:", response);
    }
  } catch (e: any) {
    console.error("Error carregant alumne:", e);
    error.value = "Error al carregar les dades de l'alumne";
  } finally {
    isLoading.value = false;
  }
};

// Carregar dades al muntar el component
onMounted(() => {
  loadStudent();
});
</script>

<template>
  <div class="student-detail-page">
    <!-- Navegació -->
    <div class="nav-back">
      <NuxtLink to="/pi/search" class="btn-back"> ← Tornar a la cerca </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-state">
      <p>Carregant dades de l'alumne...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadStudent" class="btn-retry">Tornar a intentar</button>
    </div>

    <!-- Dades de l'alumne -->
    <div v-else-if="student" class="detail-content">
      <div class="detail-grid">
        <!-- ESQUERRA: Dades de l'alumne -->
        <div class="detail-left">
          <div class="student-card">
            <div class="card-header">
              <div class="gencat-logo">gencat.cat</div>
              <h1>{{ student.nom }} {{ student.cognoms }}</h1>
            </div>

            <div class="info-list">
              <div class="info-item">
                <span class="info-label">RALC:</span>
                <span class="info-value">{{
                  student.ralc || "No disponible"
                }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">DNI / TIE:</span>
                <span class="info-value">{{ student.dni || "-" }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Data de Naixement:</span>
                <span class="info-value">
                  {{
                    student.dataNaixement
                      ? new Date(student.dataNaixement).toLocaleDateString(
                          "ca-ES"
                        )
                      : "-"
                  }}
                </span>
              </div>

              <div class="info-item">
                <span class="info-label">Curs:</span>
                <span class="info-value">{{ student.curs || "-" }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Centre de Procedència:</span>
                <span class="info-value">{{
                  student.centreProcedencia || "-"
                }}</span>
              </div>
            </div>

            <!-- Plans Individualitzats -->
            <div
              v-if="student.pis && student.pis.length > 0"
              class="pis-section"
            >
              <h2>Plans Individualitzats</h2>
              <div class="pis-list">
                <div v-for="pi in student.pis" :key="pi.id" class="pi-card">
                  <div class="pi-header">
                    <span
                      class="pi-estat"
                      :class="pi.estat ? 'estat-' + pi.estat.toLowerCase() : ''"
                    >
                      {{ pi.estat || "Sense estat" }}
                    </span>
                    <span class="pi-date" v-if="pi.data_creacio">
                      {{
                        new Date(pi.data_creacio).toLocaleDateString("ca-ES")
                      }}
                    </span>
                  </div>
                  <p
                    class="pi-professor"
                    v-if="pi.professorNom || pi.professorCognom"
                  >
                    Professor: {{ pi.professorNom || "" }}
                    {{ pi.professorCognom || "" }}
                  </p>
                  <p class="pi-ia" v-if="pi.dades_ia">
                    {{
                      pi.dades_ia.length > 150
                        ? pi.dades_ia.substring(0, 150) + "..."
                        : pi.dades_ia
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>
                Aquest alumne encara no té plans individualitzats assignats.
              </p>
            </div>
          </div>
        </div>

        <!-- DRETA: Previsualització amb pestanyes -->
        <div class="detail-right">
          <div class="preview-container">
            <!-- Pestanyes -->
            <div class="tabs-header">
              <button 
                :class="['tab-button', { active: activeTab === 'ia' }]"
                @click="changeTab('ia')"
              >
                Dades generades previament
              </button>
              <button 
                :class="['tab-button', { active: activeTab === 'pdf' }]"
                @click="changeTab('pdf')"
              >
                PDF Original
              </button>
            </div>

            <!-- Contingut de les pestanyes -->
            <div class="tabs-content">
              <!-- Pestanya: Dades generades per IA -->
              <div v-if="activeTab === 'ia'" class="tab-panel">
                <div class="ia-preview">
                  <h3>Informe generat previament</h3>
                  <div class="ia-content">
                    <p class="placeholder-text">
                      Aquí es mostraran les dades generades previament amb ajusts del professor.
                    </p>
                    <p class="placeholder-text">
                      Aquesta funcionalitat s'implementarà properament i inclourà l'anàlisi complet del pla individualitzat.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Pestanya: PDF Original -->
              <div v-if="activeTab === 'pdf'" class="tab-panel">
                <div class="pdf-preview">
                  <h3>Document PDF original</h3>
                  <div class="pdf-viewer-placeholder">
                    <p class="placeholder-text">
                      Aquí es mostrarà la previsualització del document PDF original carregat pel professor.
                    </p>
                    <p class="placeholder-text">
                      Aquesta funcionalitat s'implementarà properament amb un visor de PDFs integrat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.student-detail-page {
  background-color: #e8e8e8;
  min-height: calc(100vh - 140px);
  padding: 40px;
}

.nav-back {
  max-width: 1400px;
  margin: 0 auto 30px;
}

.btn-back {
  display: inline-block;
  padding: 10px 20px;
  background-color: white;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 500;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-back:hover {
  background-color: #f5f5f5;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-state p {
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  color: #666;
  margin: 0;
}

.error-state p {
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  color: #c8102e;
  margin: 0 0 20px 0;
}

.btn-retry {
  padding: 10px 24px;
  background-color: #007a33;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-retry:hover {
  background-color: #005a24;
}

.detail-content {
  max-width: 1400px;
  margin: 0 auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.detail-left {
  display: flex;
  flex-direction: column;
}

.student-card {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 20px;
}

.gencat-logo {
  font-size: 20px;
  font-weight: 700;
  color: #c8102e;
  font-family: "Open Sans", sans-serif;
  margin-bottom: 15px;
}

.card-header h1 {
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 28px;
  color: #333;
  margin: 0;
  line-height: 1.3;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: #555;
}

.info-value {
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  color: #333;
  font-weight: 500;
  text-align: right;
}

.pis-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
}

.pis-section h2 {
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 22px;
  color: #333;
  margin-bottom: 20px;
  margin-top: 0;
}

.pis-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pi-card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
}

.pi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pi-estat {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  background-color: #e5e7eb;
  color: #555;
}

.pi-estat.estat-actiu {
  background-color: #d1fae5;
  color: #065f46;
}

.pi-estat.estat-pendent {
  background-color: #fef3c7;
  color: #92400e;
}

.pi-date {
  font-size: 13px;
  color: #6b7280;
  font-family: "Open Sans", sans-serif;
}

.pi-professor {
  font-size: 14px;
  color: #374151;
  font-family: "Open Sans", sans-serif;
  margin: 8px 0;
  font-weight: 500;
}

.pi-ia {
  font-size: 14px;
  color: #6b7280;
  font-family: "Open Sans", sans-serif;
  line-height: 1.5;
  margin: 8px 0 0 0;
}

.empty-state {
  padding: 30px 20px;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 6px;
  margin-top: 30px;
}

.empty-state p {
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  color: #6b7280;
  margin: 0;
}

.detail-right {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* Contenidor de pestanyes */
.preview-container {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header de les pestanyes */
.tabs-header {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  background-color: #f8f8f8;
}

.tab-button {
  flex: 1;
  padding: 16px 24px;
  background: none;
  border: none;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background-color: #f0f0f0;
  color: #333;
}

.tab-button.active {
  color: #c8102e;
  background-color: white;
  border-bottom-color: #c8102e;
}

/* Contingut de les pestanyes */
.tabs-content {
  min-height: 600px;
}

.tab-panel {
  padding: 30px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pestanya IA */
.ia-preview h3 {
  font-family: "Open Sans", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.ia-content {
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 6px;
  border-left: 4px solid #c8102e;
}

/* Pestanya PDF */
.pdf-preview {
  display: flex;
  flex-direction: column;
}

.pdf-preview h3 {
  font-family: "Open Sans", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.pdf-viewer-placeholder {
  background-color: #2c2c2c;
  padding: 60px 40px;
  border-radius: 6px;
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.pdf-viewer-placeholder .placeholder-text {
  color: #aaa;
}

@media (max-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .pdf-preview {
    height: 500px;
  }
}
</style>
