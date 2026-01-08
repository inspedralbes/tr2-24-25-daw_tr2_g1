<template>
  <div class="login-container">
    <div class="login-card">
      <div class="header">
        <h1 class="title">PlaPI</h1>
        <p class="subtitle">Accés per a Centres Educatius</p>
      </div>

      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label for="email">Correu electrònic del centre (xtec)</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="a80xxxxx@xtec.cat" 
            required
            class="input-gencat"
          />
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Comprovant...' : 'Entrar' }}
        </button>
      </form>

      <div class="footer">
        <small>Departament d'Educació</small>
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports necesarios de Vue/Nuxt
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // O useNuxtApp si es Nuxt puro

const email = ref('');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter(); // Para redirigir

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    // 1. Llamada al Backend (ajusta la URL si tu back no está en localhost:3000)
    // En Nuxt solemos usar useFetch, pero fetch normal funciona bien aquí
    const response = await fetch('http://localhost:3000/api/login-centre', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    });

    const data = await response.json();

    if (response.ok) {
      // 2. ÉXITO: Guardamos datos en localStorage (opcional, para recordar quién es)
      localStorage.setItem('user_centre', JSON.stringify(data.centre));
      
      // 3. Redirigir a la HOME
      router.push('/'); // O router.push('/home') según tu ruta principal
    } else {
      // ERROR: El email no existe
      errorMessage.value = data.error || 'Error al iniciar sessió';
    }

  } catch (error) {
    errorMessage.value = 'Error de connexió amb el servidor';
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Estilos sencillos y limpios */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.title {
  color: #D9001D; /* Rojo Gencat */
  margin: 0;
  font-size: 2rem;
}

.subtitle {
  color: #666;
  margin-top: 5px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.input-gencat {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #D9001D;
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn-login:hover {
  background-color: #b00018;
}

.btn-login:disabled {
  background-color: #ccc;
}

.error-msg {
  color: #D9001D;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.footer {
  margin-top: 30px;
  color: #999;
  border-top: 1px solid #eee;
  padding-top: 20px;
}
</style>