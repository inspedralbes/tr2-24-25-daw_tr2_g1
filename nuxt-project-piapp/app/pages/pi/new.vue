<script setup>
// Tu lógica aquí si la necesitas
</script>

<template>
  <div class="main-content">
    
    <div class="container">
      
      <div class="page-header">
        <h1>Crear Nou PI</h1>
        <p>Pujar arxiu PDF per iniciar l'anàlisi</p>
      </div>

      <div class="form-card">
        
        <div class="form-section">
          <h2>Pujada de fitxers</h2>
          <p class="description">
            Selecciona o arrossega el Pla Individualitzat (PDF) de l'alumne.
          </p>
          
          <div class="upload-wrapper">
            <FileUpload />
          </div>

        </div>

        <div class="form-actions">
          <NuxtLink to="/" class="btn-cancel">Cancel·lar</NuxtLink>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.main-content {
  background-color: #f5f5f5;
  min-height: calc(100vh - 140px);
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column; 
  gap: 30px; 
}

.page-header {
  width: 100%;
}

.page-header h1 {
  font-family: 'Open Sans', sans-serif;
  font-weight: 700;
  font-size: 32px; 
  color: #333;
  margin-bottom: 10px;
  line-height: 1.2;
}

.page-header p {
  color: #666;
  font-size: 18px;
  margin: 0;
}

.form-card {
  background-color: white;
  border: 1px solid #ddd;
  border-top: 4px solid #d00000; 
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  padding: 30px;
  width: 100%; 
  box-sizing: border-box; 
}

.form-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
  margin-top: 0;
}

.description {
  font-size: 15px;
  color: #555;
  margin-bottom: 25px;
}

.upload-wrapper {
  background-color: #fafafa;
  border: 2px dashed #ddd; 
  border-radius: 6px;
  padding: 30px;
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-cancel {
  text-decoration: none;
  color: #555;
  font-size: 14px;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: #f0f0f0;
  color: #333;
  border-color: #bbb;
}
</style>