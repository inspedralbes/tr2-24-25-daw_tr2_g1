<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// --- ESTADO ANIMACIÓN INTRO ---
const showIntroAnimation = ref(true); // Controla la intro de carga

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
}

const route = useRoute();
const studentRalc = route.params.id;

// Estat de càrrega de dades
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

    // Detectar si estem al servidor o al client per usar la URL correcta
    const baseURL = import.meta.server ? 'http://backend:3000' : 'http://localhost:3000'
    const response = await $fetch<ApiResponse>(`${baseURL}/api/alumne/${studentRalc}`);

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

// Funció per parsejar les dades de la IA
const getParsedData = (dadesIa: any) => {
  if (!dadesIa) return null;
  
  try {
    if (typeof dadesIa === 'object') return dadesIa;
    if (typeof dadesIa === 'string') {
      return JSON.parse(dadesIa);
    }
    return null;
  } catch (error) {
    console.error('Error parsejant dades IA:', error);
    return null;
  }
};

// Funció per obtenir l'URL del PDF identificat pel RALC
const getPdfUrl = () => {
  if (!student.value?.ralc) return null;
  const baseURL = 'http://localhost:3000';
  return `${baseURL}/api/pdf/${student.value.ralc}`;
};

// Funció per descarregar el PDF
const downloadPDF = () => {
  const pdfUrl = getPdfUrl();
  if (!pdfUrl) return;
  
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = `${student.value?.ralc}.pdf`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Carregar dades al muntar el component
onMounted(() => {
  loadStudent();
  
  // --- LÓGICA DE ANIMACIÓN (1.5 SEGUNDOS) ---
  setTimeout(() => {
    showIntroAnimation.value = false;
  }, 1500); // <--- CAMBIADO A 1500ms
});
</script>

<template>
  <div class="page-container">
    
    <div v-if="showIntroAnimation" class="loading-intro-container">
      <div class="spinner-large"></div>
      <h2 class="loading-text">Generant entorn de l'alumne...</h2>
    </div>

    <div v-else class="student-detail-page fade-in">
      
      <div class="nav-back">
        <NuxtLink to="/pi/search" class="btn-back"> ← Tornar a la cerca </NuxtLink>
      </div>

      <div v-if="isLoading" class="loading-state">
        <p>Carregant dades de l'alumne...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadStudent" class="btn-retry">Tornar a intentar</button>
      </div>

      <div v-else-if="student" class="detail-content">
        <div class="detail-grid">
          
          <div class="detail-left">
            <div class="student-card">
              <div class="card-header">
                <div class="gencat-logo">gencat.cat</div>
                <h1>{{ student.nom }} {{ student.cognoms }}</h1>
              </div>

              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">RALC:</span>
                  <span class="info-value">{{ student.ralc || "No disponible" }}</span>
                </div>

                <div class="info-item">
                  <span class="info-label">DNI / TIE:</span>
                  <span class="info-value">{{ student.dni || "-" }}</span>
                </div>

                <div class="info-item">
                  <span class="info-label">Data de Naixement:</span>
                  <span class="info-value">
                    {{ student.dataNaixement ? new Date(student.dataNaixement).toLocaleDateString("ca-ES") : "-" }}
                  </span>
                </div>

                <div class="info-item">
                  <span class="info-label">Curs:</span>
                  <span class="info-value">{{ student.curs || "-" }}</span>
                </div>

                <div class="info-item">
                  <span class="info-label">Centre de Procedència:</span>
                  <span class="info-value">{{ student.centreProcedencia || "-" }}</span>
                </div>
              </div>

              <div v-if="student.pis && student.pis.length > 0" class="pis-section">
                <h2>Plans Individualitzats</h2>
                <div class="pis-list">
                  <div v-for="pi in student.pis" :key="pi.id" class="pi-card">
                    <div class="pi-header">
                      <span class="pi-estat" :class="pi.estat ? 'estat-' + pi.estat.toLowerCase() : ''">
                        {{ pi.estat || "Sense estat" }}
                      </span>
                      <span class="pi-date" v-if="pi.data_creacio">
                        {{ new Date(pi.data_creacio).toLocaleDateString("ca-ES") }}
                      </span>
                    </div>
                    <p class="pi-professor" v-if="pi.professorNom || pi.professorCognom">
                      Professor: {{ pi.professorNom || "" }} {{ pi.professorCognom || "" }}
                    </p>
                    <p class="pi-ia" v-if="pi.dades_ia">
                      {{ pi.dades_ia.length > 150 ? pi.dades_ia.substring(0, 150) + "..." : pi.dades_ia }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <p>Aquest alumne encara no té plans individualitzats assignats.</p>
              </div>
            </div>
          </div>

          <div class="detail-right">
            <div class="preview-container">
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

              <div class="tabs-content">
                <div v-if="activeTab === 'ia'" class="tab-panel">
                  <div class="ia-preview">
                    <h3>Informe generat previament</h3>
                    <div v-if="student?.pis && student.pis.length > 0" class="ia-content">
                      <div v-for="pi in student.pis" :key="pi.id" class="pi-section">
                        <div class="pi-header">
                          <h4>Pla Individualitzat #{{ pi.id }}</h4>
                        </div>
                        
                        <div class="pi-info-row">
                          <div class="pi-info-field">
                            <label class="info-label">Data de creació:</label>
                            <p class="info-value">{{ new Date(pi.data_creacio).toLocaleDateString('ca-ES') }}</p>
                          </div>
                          <div class="pi-info-field">
                            <label class="info-label">Professor responsable:</label>
                            <p class="info-value">{{ pi.professorNom }} ({{ pi.professorEmail }})</p>
                          </div>
                        </div>

                        <div class="pi-form-fields">
                          <div class="form-row">
                            <div class="form-field half-width">
                              <label class="field-label">Dificultat:</label>
                              <div class="field-input" :class="{ 'empty-state': !pi.dificultat }">
                                {{ pi.dificultat || '' }}
                              </div>
                            </div>
                            <div class="form-field half-width">
                              <label class="field-label">Gravetat:</label>
                              <div class="field-input" :class="{ 'empty-state': !pi.gravetat }">
                                {{ pi.gravetat || '' }}
                              </div>
                            </div>
                          </div>

                          <div class="form-field">
                            <label class="field-label">Justificació:</label>
                            <div class="field-textarea" :class="{ 'empty-state': !pi.justificacio }">
                              {{ pi.justificacio || '' }}
                            </div>
                          </div>

                          <div class="form-field">
                            <label class="field-label">Proposta educativa:</label>
                            <div class="field-textarea" :class="{ 'empty-state': !pi.proposta_educativa }">
                              {{ pi.proposta_educativa || '' }}
                            </div>
                          </div>

                          <div class="form-field">
                            <label class="field-label">Observacions:</label>
                            <div class="field-textarea" :class="{ 'empty-state': !pi.observacio }">
                              {{ pi.observacio || '' }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="ia-content empty-content">
                      <p class="placeholder-text">
                        Aquest alumne encara no té cap pla individualitzat generat.
                      </p>
                    </div>
                  </div>
                </div>

                <div v-if="activeTab === 'pdf'" class="tab-panel">
                  <div class="pdf-preview">
                    <div class="pdf-header">
                      <h3>Document PDF original</h3>
                    </div>
                    <div class="pdf-viewer-container">
                      <iframe 
                        v-if="getPdfUrl()" 
                        :src="getPdfUrl() ?? undefined" 
                        class="pdf-iframe"
                        frameborder="0"
                      ></iframe>
                      <div v-else class="pdf-viewer-placeholder">
                        <p class="placeholder-text">
                          Aquest alumne encara no té cap document PDF carregat.
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
    </div>
  </div>
</template>

<style scoped>
/* --- ESTILOS DE LA PANTALLA DE CARGA (SPINNER) --- */
.loading-intro-container {
  min-height: calc(100vh - 100px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4; 
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 5px solid #ddd;
  border-top: 5px solid #d9001d; /* Rojo Gencat */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 25px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-family: "Open Sans", sans-serif;
  color: #333;
  font-size: 20px;
  font-weight: 600;
  animation: fadeInText 1s ease-in;
}

@keyframes fadeInText {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeInContent 0.6s ease-out;
}
@keyframes fadeInContent {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* --- ESTILOS GENERALES Y ALINEACIÓN --- */
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
  transition: all 0.2s ease; /* Transición suave */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
}

/* HOVER MÁS NOTORIO */
.btn-back:hover {
  background-color: #e2e2e2; /* Gris más oscuro */
  border-color: #c8102e; /* Borde rojo sutil */
  color: #c8102e; /* Texto rojo */
  transform: translateY(-1px);
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

.loading-state p { font-family: "Open Sans", sans-serif; font-size: 18px; color: #666; margin: 0; }
.error-state p { font-family: "Open Sans", sans-serif; font-size: 18px; color: #c8102e; margin: 0 0 20px 0; }

.btn-retry { padding: 10px 24px; background-color: #007a33; color: white; border: none; border-radius: 4px; font-family: "Open Sans", sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
.btn-retry:hover { background-color: #005a24; }

/* LAYOUT DE GRID ALINEADO */
.detail-content { max-width: 1400px; margin: 0 auto; }

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  /* ESTO ES LA CLAVE PARA QUE TERMINEN EN LÍNEA */
  align-items: stretch; 
}

.detail-left { 
  display: flex; 
  flex-direction: column; 
  height: 100%;
}

.student-card {
  background-color: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* Para que ocupe todo el alto */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header { margin-bottom: 30px; border-bottom: 2px solid #e0e0e0; padding-bottom: 20px; }
.gencat-logo { font-size: 20px; font-weight: 700; color: #c8102e; font-family: "Open Sans", sans-serif; margin-bottom: 15px; }
.card-header h1 { font-family: "Open Sans", sans-serif; font-weight: 600; font-size: 28px; color: #333; margin: 0; line-height: 1.3; }

.info-list { display: flex; flex-direction: column; gap: 18px; margin-bottom: 30px; }
.info-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; }
.info-item:last-child { border-bottom: none; }
.info-label { font-family: "Open Sans", sans-serif; font-weight: 600; font-size: 15px; color: #555; }
.info-value { font-family: "Open Sans", sans-serif; font-size: 15px; color: #333; font-weight: 500; text-align: right; }

.pis-section { margin-top: 30px; padding-top: 30px; border-top: 2px solid #e0e0e0; flex-grow: 1; /* Empuja el contenido para llenar espacio si hace falta */ }
.pis-section h2 { font-family: "Open Sans", sans-serif; font-weight: 600; font-size: 22px; color: #333; margin-bottom: 20px; margin-top: 0; }
.pis-list { display: flex; flex-direction: column; gap: 16px; }
.pi-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; }
.pi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.pi-estat { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-family: "Open Sans", sans-serif; font-weight: 600; text-transform: uppercase; background-color: #e5e7eb; color: #555; }
.pi-estat.estat-actiu { background-color: #d1fae5; color: #065f46; }
.pi-estat.estat-pendent { background-color: #fef3c7; color: #92400e; }
.pi-date { font-size: 13px; color: #6b7280; font-family: "Open Sans", sans-serif; }
.pi-professor { font-size: 14px; color: #374151; font-family: "Open Sans", sans-serif; margin: 8px 0; font-weight: 500; }
.pi-ia { font-size: 14px; color: #6b7280; font-family: "Open Sans", sans-serif; line-height: 1.5; margin: 8px 0 0 0; }
.empty-state { padding: 30px 20px; text-align: center; background-color: #f9fafb; border-radius: 6px; margin-top: 30px; }
.empty-state p { font-family: "Open Sans", sans-serif; font-size: 15px; color: #6b7280; margin: 0; }

.detail-right { 
  display: flex; 
  align-items: flex-start; 
  justify-content: center;
  height: 100%; /* Llenar columna */
}

/* Contenidor de pestanyes */
.preview-container {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%; /* Llenar altura para igualar izquierda */
  display: flex;
  flex-direction: column;
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

.tab-button:hover { background-color: #f0f0f0; color: #333; }
.tab-button.active { color: #c8102e; background-color: white; border-bottom-color: #c8102e; }

/* Contingut de les pestanyes */
.tabs-content {
  flex: 1; /* Ocupar el resto del espacio */
  display: flex;
  flex-direction: column;
  min-height: 600px; /* Altura mínima para asegurar buena vista */
}

.tab-panel {
  padding: 30px;
  animation: fadeIn 0.3s ease-in;
  flex: 1; /* Estirar */
  display: flex;
  flex-direction: column;
}

/* Pestanya IA */
.ia-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.ia-preview h3 { font-family: "Open Sans", sans-serif; font-size: 20px; font-weight: 600; color: #333; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e0e0e0; }
.ia-content { background-color: #f8f9fa; padding: 25px; border-radius: 6px; border-left: 4px solid #c8102e; flex: 1; }
.pi-section { background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.pi-section:last-child { margin-bottom: 0; }
.pi-header h4 { font-family: "Open Sans", sans-serif; font-size: 18px; font-weight: 600; color: #333; margin: 0; }
.pi-info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0; }
.pi-info-field, .form-field { display: flex; flex-direction: column; }
.info-label, .field-label { font-family: "Open Sans", sans-serif; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 6px; }
.info-value { font-family: "Open Sans", sans-serif; font-size: 15px; color: #333; margin: 0; }
.pi-form-fields { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-field.half-width { flex: 1; }
.field-input, .field-textarea { font-family: "Open Sans", sans-serif; font-size: 14px; color: #333; padding: 12px; background-color: #f8f9fa; border: 1px solid #d1d5db; border-radius: 4px; min-height: 44px; display: flex; align-items: center; }
.field-textarea { min-height: 100px; align-items: flex-start; white-space: pre-wrap; }

/* Pestanya PDF */
.pdf-preview {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.pdf-header h3 { font-family: "Open Sans", sans-serif; font-size: 20px; font-weight: 600; color: #333; margin: 0; }
.btn-download { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background-color: #c8102e; color: white; border: none; border-radius: 4px; font-family: "Open Sans", sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: background-color 0.2s, opacity 0.2s; }
.btn-download:hover:not(:disabled) { background-color: #a00d25; }
.btn-download:disabled { opacity: 0.5; cursor: not-allowed; }

.pdf-viewer-container {
  width: 100%;
  flex: 1; /* Que ocupe el resto */
  min-height: 600px; /* Asegura un mínimo si la tarjeta izquierda es pequeña */
  border-top: 2px solid #e0e0e0;
  padding-top: 0;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.pdf-iframe { width: 100%; height: 100%; border: none; background-color: white; flex: 1; }
.pdf-viewer-placeholder { background-color: #f5f5f5; padding: 60px 40px; border-radius: 6px; text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.placeholder-text { font-family: "Open Sans", sans-serif; font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 15px; }

@media (max-width: 1024px) {
  .detail-grid { grid-template-columns: 1fr; gap: 30px; }
  .pdf-preview { height: 500px; }
}
</style>