<script setup lang="ts">
const searchQuery = ref('')

// Utilitzar el composable useTable
const { students, columns, isLoading, error, loadStudents } = useTable()

// Carregar dades al muntar el component
onMounted(() => {
  loadStudents()
})

// --- Lògica de Filtratge ---
// Només cercar per RALC exacte - la taula només apareix quan hi ha coincidència completa
const filteredStudents = computed(() => {
  if (!searchQuery.value) return []
  
  return toRaw(students.value).filter((s: any) => 
    s.ralc === searchQuery.value
  )
})
</script>

<template>
  <div class="search-page">
    <div class="search-hero">
      <div class="hero-content">
        <div class="hero-left">
          <div class="gencat-logo">gencat.cat</div>
          
          <h1 class="hero-title">Cerca de plans individualitzats per RALC</h1>
          
          <NuxtLink to="/ajuda/com-fer-cerca" class="help-link">
            Com fer la cerca?
          </NuxtLink>
          
          <div class="search-box">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Introdueix el RALC de l'alumne..."
              class="search-input"
            />
          </div>
        </div>
        
        <div class="hero-right">
          <!-- Informació de l'alumne - apareix on estava el vídeo -->
          <div v-if="filteredStudents.length > 0" class="results-card">
            <div v-for="student in filteredStudents" :key="student.ralc" class="student-info">
              <h2>Informació de l'alumne</h2>
              
              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">RALC:</span>
                  <span class="info-value">{{ student.ralc }}</span>
                </div>
                
                <div class="info-item">
                  <span class="info-label">Nom:</span>
                  <span class="info-value">{{ student.nom }}</span>
                </div>
                
                <div class="info-item">
                  <span class="info-label">Cognoms:</span>
                  <span class="info-value">{{ student.cognoms }}</span>
                </div>
                
                <div class="info-item">
                  <span class="info-label">Curs:</span>
                  <span class="info-value">{{ student.curs }}</span>
                </div>
              </div>
              
              <NuxtLink :to="`/student/${student.ralc}`" class="btn-primary btn-full">
                Veure pla individualitzat complet
              </NuxtLink>
            </div>
          </div>

          <!-- Missatge quan no hi ha resultats -->
          <div v-else-if="searchQuery && filteredStudents.length === 0" class="info-card">
            <p>No s'ha trobat cap alumne amb el RALC: <strong>{{ searchQuery }}</strong></p>
          </div>

          <!-- Placeholder inicial -->
          <div v-else class="info-card placeholder">
            <p>Introdueix el RALC per veure la informació de l'alumne</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  background-color: #e8e8e8;
  min-height: calc(100vh - 140px);
}

.search-hero {
  padding: 60px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.gencat-logo {
  font-size: 24px;
  font-weight: 700;
  color: #c8102e;
  font-family: "Open Sans", sans-serif;
  margin-bottom: 10px;
}

.hero-title {
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
  font-size: 48px;
  line-height: 1.2;
  color: #333;
  margin: 0;
}

.help-link {
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  color: #333;
  text-decoration: underline;
  transition: color 0.2s;
  width: fit-content;
}

.help-link:hover {
  color: #c8102e;
}

.search-box {
  margin-top: 20px;
}

.search-input {
  width: 100%;
  padding: 16px 20px;
  font-size: 18px;
  font-family: "Open Sans", sans-serif;
  border: 2px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s;
  background-color: white;
}

.search-input:focus {
  outline: none;
  border-color: #333;
}

.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.results-card,
.info-card {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.student-info h2 {
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 22px;
  color: #333;
  margin-bottom: 25px;
  margin-top: 0;
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
  padding: 12px 0;
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
}

.info-card {
  text-align: center;
  padding: 60px 30px;
}

.info-card.placeholder {
  background-color: #3c3c3c;
  color: white;
}

.info-card p {
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  margin: 0;
}

.info-card strong {
  font-weight: 600;
}

.btn-primary {
  display: inline-block;
  padding: 12px 24px;
  background-color: #007a33;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 15px;
  font-family: "Open Sans", sans-serif;
  font-weight: 500;
  transition: background-color 0.2s;
  text-align: center;
}

.btn-primary.btn-full {
  display: block;
  width: 100%;
}

.btn-primary:hover {
  background-color: #005a24;
}

@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero-title {
    font-size: 36px;
  }
}
</style>