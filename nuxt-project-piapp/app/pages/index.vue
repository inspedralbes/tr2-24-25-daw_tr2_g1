<script setup>
// ... (MISMO SCRIPT QUE ARRIBA) ...
// Copia el script de la Opción 1 o usa el que ya tenías
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('http://localhost:3000/api/login-centre', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user_centre', JSON.stringify(data.centre));
      router.push('/home');
    } else {
      errorMessage.value = data.error || 'Error al iniciar sessió';
    }
  } catch (error) {
    errorMessage.value = 'Error de connexió amb el servidor';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="glass-bg">
    <div class="login-card">
      <div class="card-header">
        <div class="logo-circle">🎓</div>
        <h1>PlaPI</h1>
      </div>

      <p class="subtitle">Accés per a Centres Educatius</p>

      <form @submit.prevent="handleLogin">
        <div class="input-wrap">
          <input 
            type="email" 
            v-model="email" 
            placeholder=" " 
            required
            id="email-input"
          />
          <label for="email-input">Correu electrònic (xtec)</label>
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '...' : 'Entrar' }}
        </button>
      </form>

      <div class="footer-links">
        <span>© Generalitat de Catalunya</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f8;
  background-image: radial-gradient(#e0e0e0 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.login-card {
  background: white;
  padding: 50px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 380px;
  text-align: center;
  transition: transform 0.3s;
}

.login-card:hover {
  transform: translateY(-5px);
}

.logo-circle {
  font-size: 2rem;
  background: #fff0f0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  border: 2px solid #ffe0e0;
}

h1 {
  margin: 0;
  color: #D9001D;
  font-weight: 800;
  letter-spacing: -1px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

/* Floating Label Style */
.input-wrap {
  position: relative;
  margin-bottom: 20px;
  text-align: left;
}

.input-wrap input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #f9f9f9;
  outline: none;
  box-sizing: border-box; 
  transition: all 0.2s;
}

.input-wrap input:focus {
  background: white;
  border-color: #D9001D;
  box-shadow: 0 0 0 4px rgba(217, 0, 29, 0.1);
}

/* Truco CSS para que el label flote */
.input-wrap label {
  position: absolute;
  left: 15px;
  top: 16px;
  color: #999;
  pointer-events: none;
  transition: 0.2s ease all;
}

.input-wrap input:focus ~ label,
.input-wrap input:not(:placeholder-shown) ~ label {
  top: -10px;
  left: 10px;
  font-size: 0.75rem;
  background: white;
  padding: 0 5px;
  color: #D9001D;
  font-weight: bold;
}

.btn-primary {
  width: 100%;
  padding: 15px;
  background: #D9001D;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(217, 0, 29, 0.3);
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #b00018;
}

.error-msg {
  color: #D9001D;
  font-size: 0.85rem;
  margin-bottom: 15px;
}

.footer-links {
  margin-top: 30px;
  font-size: 0.75rem;
  color: #aaa;
}
</style>