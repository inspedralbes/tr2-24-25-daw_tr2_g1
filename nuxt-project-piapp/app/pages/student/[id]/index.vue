<script setup lang="ts">
const route = useRoute()
const studentRalc = route.params.id

// Estat de càrrega
const isLoading = ref(true)
const error = ref(null)
const student = ref(null)

// Carregar dades de l'alumne des de l'API - igual que search.vue
const loadStudent = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Cridar a la mateixa API que search.vue però filtrant per aquest RALC
    const response = await $fetch('http://localhost:3000/api/alumnes')
    
    console.log('Response completa:', response)
    
    if (response?.success && Array.isArray(response.data)) {
      // Buscar l'alumne amb aquest RALC
      const foundStudent = response.data.find((s: any) => s.ralc === studentRalc)
      
      if (foundStudent) {
        student.value = foundStudent
        console.log('Alumne trobat:', foundStudent)
      } else {
        error.value = 'No s\'ha trobat l\'alumne amb aquest RALC'
      }
    } else {
      error.value = 'Error al carregar les dades'
      console.error('Format de resposta incorrecte:', response)
    }
  } catch (e) {
    console.error('Error carregant alumne:', e)
    error.value = 'Error al carregar les dades de l\'alumne'
  } finally {
    isLoading.value = false
  }
}

// Carregar dades al muntar el component
onMounted(() => {
  loadStudent()
})
</script>

<template>
  <div class="student-detail-page page-background">
    <!-- Navegació -->
    <div class="nav-back">
      <NuxtLink to="/search" class="btn-back">
        ← Tornar a la cerca
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-state white-card">
      <p>Carregant dades de l'alumne...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state white-card">
      <p>{{ error }}</p>
      <button @click="loadStudent" class="btn-retry">Tornar a intentar</button>
    </div>

    <!-- Dades de l'alumne -->
    <div v-else-if="student" class="detail-content">
      <div class="detail-grid">
        <!-- ESQUERRA: Dades de l'alumne -->
        <div class="detail-left">
          <div class="student-card white-card">
            <div class="card-header">
              <div class="gencat-logo">gencat.cat</div>
              <h1>{{ student.nom }} {{ student.cognoms }}</h1>
            </div>

            <div class="info-list">
              <div class="info-item">
                <span class="info-label">RALC:</span>
                <span class="info-value">{{ student.ralc || 'No disponible' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">DNI / TIE:</span>
                <span class="info-value">{{ student.dni || '-' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Data de Naixement:</span>
                <span class="info-value">
                  {{ student.dataNaixement ? new Date(student.dataNaixement).toLocaleDateString('ca-ES') : '-' }}
                </span>
              </div>

              <div class="info-item">
                <span class="info-label">Curs:</span>
                <span class="info-value">{{ student.curs || '-' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">Centre de Procedència:</span>
                <span class="info-value">{{ student.centreProcedencia || '-' }}</span>
              </div>
            </div>

            <!-- Plans Individualitzats -->
            <div v-if="student.pis && student.pis.length > 0" class="pis-section">
              <h2 class="section-title">Plans Individualitzats</h2>
              <div class="pis-list">
                <div v-for="pi in student.pis" :key="pi.id" class="pi-card">
                  <div class="pi-header">
                    <span class="pi-estat" :class="pi.estat ? 'estat-' + pi.estat.toLowerCase() : ''">
                      {{ pi.estat || 'Sense estat' }}
                    </span>
                    <span class="pi-date" v-if="pi.data_creacio">
                      {{ new Date(pi.data_creacio).toLocaleDateString('ca-ES') }}
                    </span>
                  </div>
                  <p class="pi-professor" v-if="pi.professorNom || pi.professorCognom">
                    Professor: {{ pi.professorNom || '' }} {{ pi.professorCognom || '' }}
                  </p>
                  <p class="pi-ia" v-if="pi.dades_ia">
                    {{ pi.dades_ia.length > 150 ? pi.dades_ia.substring(0, 150) + '...' : pi.dades_ia }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>Aquest alumne encara no té plans individualitzats assignats.</p>
            </div>
          </div>
        </div>

        <!-- DRETA: Previsualització PDF (placeholder) -->
        <div class="detail-right">
          <div class="pdf-preview">
            <p>Previsualització del PDF</p>
            <small>Aquesta funcionalitat s'implementarà properament</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.student-detail-page {
  padding: 40px;
}

.loading-state, .error-state {
  text-align: center;
  padding: 60px 20px;
  max-width: 600px;
  margin: 0 auto;
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
  background-color: #c8102e;
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
  background-color: #a00d25;
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
  padding: 40px;
}

.card-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 20px;
}

.card-header h1 {
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 28px;
  color: #333;
  margin: 0;
  line-height: 1.3;
}

.info-value {
  text-align: right;
}

.pis-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
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

.pdf-preview {
  width: 100%;
  height: 700px;
  background-color: #2c2c2c;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 40px;
}

.pdf-preview p {
  font-family: "Open Sans", sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.pdf-preview small {
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  opacity: 0.7;
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