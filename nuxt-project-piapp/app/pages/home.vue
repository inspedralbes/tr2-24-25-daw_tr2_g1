<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const centre = ref(null);

onMounted(() => {
  // 1. Miramos si hay usuario guardado en el navegador
  const savedCentre = localStorage.getItem('user_centre');
  
  if (!savedCentre) {
    // 2. Si NO hay usuario, lo echamos fuera (al Login que ahora es '/')
    router.push('/');
  } else {
    // 3. Si SÍ hay, guardamos los datos para usarlos en el HTML
    centre.value = JSON.parse(savedCentre);
  }
});

const logout = () => {
  // Borramos la sesión y volvemos al login
  localStorage.removeItem('user_centre');
  router.push('/');
};
</script>

<template>
  <div class="main-content">
    
    <div class="container">
      
      <section class="intro" v-if="centre">
        <div class="header-row">
          <h1>Benvingut/da, <span class="highlight">{{ centre.nom }}</span></h1>
          <button @click="logout" class="btn-logout">Tancar Sessió</button>
        </div>
        
        <p class="subtitle">
          Aquesta eina permet agilitzar la creació i gestió dels PIs mitjançant intel·ligència artificial. 
          Selecciona una de les opcions següents per començar:
        </p>
      </section>

      <div v-else class="loading">Carregant...</div>

      <div class="grid-opciones">
        
        <NuxtLink to="/pi/new" class="card-gencat">
          <div class="text-card">
            <h3>Crear Nou PI</h3>
            <p>Iniciar un nou tràmit d'alumne (Opció A).</p>
          </div>
          <div class="arrow">→</div>
        </NuxtLink>

        <NuxtLink to="/temporal/formPage" class="card-gencat">
          <div class="text-card">
            <h3>Formulari de Prova</h3>
            <p>Accés al formulari temporal (Form Page).</p>
          </div>
          <div class="arrow">→</div>
        </NuxtLink>

      </div>

    </div>
  </div>
</template>

<style scoped>
/* TU CSS ORIGINAL */
.main-content {
  background-color: #f5f5f5; 
  min-height: calc(100vh - 140px); 
  padding-bottom: 40px;
}

.container {
  max-width: 1000px; 
  margin: 0 auto;    
  padding: 50px 20px;
  display: flex;
  flex-direction: column; 
  gap: 40px; 
}

.intro {
  border-bottom: 1px solid #e0e0e0; 
  padding-bottom: 20px;
}

/* HE AÑADIDO ESTO PARA EL TITULO Y BOTON */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
}

.intro h1 {
  font-family: 'Open Sans', sans-serif;
  font-weight: 700; 
  font-size: 32px;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.2;
}

.highlight {
  color: #d00000; /* El nombre del centro en rojo */
}

.btn-logout {
  background-color: transparent;
  border: 1px solid #999;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.2s;
}
.btn-logout:hover {
  background-color: #333;
  color: white;
  border-color: #333;
}

.subtitle {
  font-family: 'Open Sans', sans-serif;
  color: #555;
  font-size: 18px;
  line-height: 1.6;
  max-width: 800px; 
}

.grid-opciones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 25px; 
  width: 100%;
}

.card-gencat {
  background-color: white;
  text-decoration: none;
  border: 1px solid #ddd;
  border-left: 5px solid #d00000; 
  padding: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card-gencat:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: #bbb;
}

.text-card h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.card-gencat:hover h3 {
  color: #d00000; 
}

.text-card p {
  margin: 0;
  font-size: 14px;
  color: #666;
}


.arrow {
  font-size: 24px;
  color: #d00000;
  margin-left: 20px;
  font-weight: bold;
}
</style>