<script setup lang="ts">
const searchQuery = ref('')

// Utilitzar el composable useTable
const { students, loadStudents } = useTable()

// Carregar dades al muntar el component
onMounted(() => {
  loadStudents()
})

// Només cercar per RALC exacte
const filteredStudents = computed(() => {
  if (!searchQuery.value) return []
  
  return toRaw(students.value).filter((s: any) => 
    s.ralc === searchQuery.value
  )
})
</script>

<template>
  <div class="search-page page-background">
    <!-- Navegació -->
    <div class="nav-back">
      <NuxtLink to="/" class="btn-back">
        ← Tornar a l'inici
      </NuxtLink>
    </div>

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
        <div v-if="filteredStudents.length > 0" class="results-card white-card">
          <div v-for="student in filteredStudents" :key="student.ralc" class="student-info">
            <h2 class="section-title">Informació de l'alumne</h2>
            
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
              Veure pla individualitzat complet.
            </NuxtLink>
          </div>
        </div>

        <div v-else-if="searchQuery && filteredStudents.length === 0" class="info-card white-card">
          <p>No s'ha trobat cap alumne amb el RALC: <strong>{{ searchQuery }}</strong></p>
        </div>

        <div v-else class="info-card placeholder">
          <p>Introdueix el RALC per veure la informació de l'alumne</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding: 40px 40px 60px;
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

.search-input {
  width: 90%;
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

.info-card {
  text-align: center;
  padding: 60px 30px;
}

.info-card.placeholder {
  background-color: #3c3c3c;
  color: white;
  border-radius: 8px;
}

.info-card p {
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  margin: 0;
}

.info-card strong {
  font-weight: 600;
}

.btn-primary.btn-full {
  display: block;
  width: auto;
  margin-top: 8px;
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