<script setup lang="ts">
import { ref, computed, onMounted, toRaw, watch } from 'vue'

const searchQuery = ref('')
const isSearching = ref(false)

// Obtenir el centre de l'usuari logat des de localStorage
const userCentre = ref<any>(null)

if (import.meta.client) {
  const stored = localStorage.getItem('user_centre')
  if (stored) {
    userCentre.value = JSON.parse(stored)
  }
}

const { students, columns, isLoading, error, loadStudents } = useTable()

onMounted(() => {
  loadStudents()
})

watch(searchQuery, (newVal) => {
  if (newVal) {
    isSearching.value = true
    setTimeout(() => { isSearching.value = false }, 600)
  } else {
    isSearching.value = false
  }
})

// --- Lògica de Filtratge ---
// Cercar per RALC exacte i verificar que el centre de l'alumne coincideix amb el del usuari logat
const filteredStudents = computed(() => {
  if (!searchQuery.value) return []
  
  const result = toRaw(students.value).filter((s: any) => {
    // Coincidència exacta del RALC
    const ralcMatch = s.ralc === searchQuery.value
    
    // Si no hi ha usuari logat, no filtrem per centre (per desenvolupament)
    if (!userCentre.value) return ralcMatch
    
    // Verificar que el centre de l'alumne coincideix amb el del usuari logat
    const centreMatch = s.centre_procedencia_id === userCentre.value.id
    
    return ralcMatch && centreMatch
  })
  
  return result
})
</script>

<template>
  <div class="search-page">
    <div class="search-hero">
      
      <div class="hero-content">
        
        <div class="hero-left">
          <div class="gencat-brand">
            <span class="brand-text">gencat.cat</span>
          </div>
          
          <h1 class="hero-title">Cerca de plans individualitzats per RALC</h1>
          
          <div class="search-wrapper">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Introdueix el RALC de l'alumne..."
              class="search-input"
            />
            <div v-if="isSearching" class="input-spinner"></div>
          </div>

          <NuxtLink to="/ajuda/com-fer-cerca" class="help-link">
            Com fer la cerca?
          </NuxtLink>
        </div>
        
        <div class="hero-right">
          
          <div v-if="filteredStudents.length > 0 && !isSearching" class="results-container fade-in">
            <div v-for="student in filteredStudents" :key="student.ralc" class="gencat-card">
              <div class="card-header">
                <h2>Informació de l'alumne</h2>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <span class="label">RALC</span>
                  <span class="value">{{ student.ralc }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Nom</span>
                  <span class="value">{{ student.nom }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Cognoms</span>
                  <span class="value">{{ student.cognoms }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Curs</span>
                  <span class="value">{{ student.curs }}</span>
                </div>

                <div class="spacer"></div>

                <div class="card-actions">
                  <NuxtLink :to="`/student/${student.ralc}`" class="btn-gencat">
                    Veure pla individualitzat complet
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="searchQuery && filteredStudents.length === 0 && !isSearching" class="info-card not-found fade-in">
            <div class="msg-content">
               <svg class="icon-svg dark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p v-if="!userCentre">No s'ha trobat cap alumne amb el RALC: <strong>{{ searchQuery }}</strong></p>
              <p v-else>
                No s'ha trobat cap alumne amb el RALC <strong>{{ searchQuery }}</strong> al teu centre.
              </p>
              </div>
          </div>

          <div v-else class="info-card placeholder fade-in">
            <div class="placeholder-content">
              <svg class="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>Introdueix el RALC per veure la informació de l'alumne</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- FONDO MÁS CLARO --- */
.search-page {
  background-color: #f4f4f4; /* ANTES ERA #e8e8e8 (MÁS OSCURO) */
  min-height: calc(100vh - 100px);
  color: #333;
}

.search-hero {
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start; /* Alineación superior estricta */
}

/* --- IZQUIERDA --- */
.hero-left {
  display: flex;
  flex-direction: column;
}

.gencat-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #d9001d;
  letter-spacing: -0.5px;
  font-family: Arial, sans-serif;
}

.hero-title {
  font-weight: 300;
  font-size: 44px;
  line-height: 1.2;
  color: #1d1d1d;
  margin: 0 0 30px 0;
}

.search-wrapper {
  width: 100%;
  max-width: 480px;
  margin-bottom: 15px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 16px 16px;
  padding-right: 45px;
  font-size: 18px;
  border: 1px solid #aaa;
  border-radius: 2px;
  background-color: white;
  transition: all 0.2s ease;
  color: #333;
}

.search-input:focus {
  outline: none;
  border-color: #d9001d;
  box-shadow: 0 0 0 3px rgba(217, 0, 29, 0.1);
}

.input-spinner {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-top-color: #d9001d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }

.help-link {
  font-size: 14px;
  color: #555;
  text-decoration: underline;
  cursor: pointer;
}
.help-link:hover { color: #d9001d; }

/* --- DERECHA (CORREGIDA ALINEACIÓN) --- */
.hero-right {
  margin-top: 0; /* ELIMINADO EL MARGEN SUPERIOR PARA QUE SUBA */
  width: 100%;
}

/* --- TARJETAS --- */
.gencat-card {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  border-top: 4px solid #d9001d;
}

.card-header {
  padding: 25px 30px 15px 30px;
  border-bottom: 1px solid #f0f0f0;
}
.card-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;
}
.card-body { padding: 20px 30px 30px 30px; }

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.info-row .label { color: #666; font-weight: 600; font-size: 15px; }
.info-row .value { color: #000; font-weight: 500; font-size: 15px; }

.spacer { height: 20px; }
.card-actions { margin-top: 10px; }

.btn-gencat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #d9001d;
  color: white;
  text-decoration: none;
  padding: 14px 24px;
  font-weight: 600;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.btn-gencat:hover { background-color: #a80016; }

.info-card {
  width: 100%;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 40px;
  text-align: center;
}
.info-card.placeholder {
  background-color: #3a3a3a;
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.placeholder-content { display: flex; flex-direction: column; align-items: center; gap: 15px; }
.icon-svg { width: 48px; height: 48px; opacity: 0.8; }
.icon-svg.dark path, .icon-svg.dark circle { stroke: #d9001d; }
.info-card p { font-size: 16px; font-weight: 400; margin: 0; line-height: 1.5; }
.info-card.not-found {
  background-color: #fff;
  border-left: 5px solid #d9001d;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  color: #333;
}
.msg-content { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 900px) {
  .hero-content { grid-template-columns: 1fr; gap: 40px; }
}
</style>