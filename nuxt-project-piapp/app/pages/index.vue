<script setup>
</script>

<template>
  <div class="main-content">
    
    <div class="container">
      
      <section class="intro">
        <h1>Benvingut/da al Gestor de Plans Individualitzats</h1>
        <p class="subtitle">
          Aquesta eina permet agilitzar la creació i gestió dels PIs mitjançant intel·ligència artificial. 
          Selecciona una de les opcions següents per començar:
        </p>
      </section>

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

.intro h1 {
  font-family: 'Open Sans', sans-serif;
  font-weight: 700; 
  font-size: 32px;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.2;
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