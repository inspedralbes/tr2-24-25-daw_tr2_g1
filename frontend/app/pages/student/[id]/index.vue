<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { GoogleLogin } from 'vue3-google-login';

const router = useRouter();

// --- ESTADO ---
const email = ref('');
const password = ref(''); // (Opcional si decides usar password en el futuro)
const errorMsg = ref('');
const isLoading = ref(false);

// --- CICLO DE VIDA ---
onMounted(() => {
  // Si ya hay sesión, redirigir
  const session = localStorage.getItem('user_centre');
  if (session) {
    router.push('/home');
  }
});

// --- LÓGICA DE LOGIN ---

// 1. Login con Google
const handleGoogleLogin = async (response) => {
  try {
    const res = await fetch('http://localhost:3000/api/login-google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: response.credential })
    });

    const data = await res.json();

    if (data.success) {
      // Guardar sesión (sirve tanto para centros como para profes)
      localStorage.setItem('user_centre', JSON.stringify(data.centre));
      router.push('/home');
    } else {
      errorMsg.value = data.error || "Error d'autenticació amb Google";
    }
  } catch (e) {
    console.error(e);
    errorMsg.value = "Error de connexió amb el servidor";
  }
};

// 2. Login con Email (Centros)
const handleCenterLogin = async () => {
  if (!email.value) return;
  
  isLoading.value = true;
  errorMsg.value = '';

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('user_centre', JSON.stringify(data.centre));
      router.push('/home');
    } else {
      errorMsg.value = data.error || "Aquest correu no pertany a cap centre registrat";
    }
  } catch (e) {
    console.error(e);
    errorMsg.value = "Error de connexió amb el servidor";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      
      <div class="logo-header">
        <span class="gencat-brand">gencat.cat</span>
        <h1 class="app-title">Traspàs de PIs</h1>
        <p class="subtitle">Gestió de Plans Individualitzats</p>
      </div>

      <form @submit.prevent="handleCenterLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correu del Centre</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="codicentre@xtec.cat" 
            required
            :disabled="isLoading"
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Entrant...' : 'Entrar com a Centre' }}
        </button>
      </form>

      <div class="divider">
        <span>o</span>
      </div>

      <div class="google-section">
        <p class="google-hint">Si ets docent, entra amb Google:</p>
        <div class="google-btn-wrapper">
          <GoogleLogin :callback="handleGoogleLogin" />
        </div>
      </div>

      <div v-if="errorMsg" class="error-box">
        {{ errorMsg }}
      </div>

    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, Arial, sans-serif;
}

.login-card {
  background: white;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-top: 5px solid #d9001d; /* Rojo Gencat */
}

.logo-header {
  text-align: center;
  margin-bottom: 30px;
}

.gencat-brand {
  font-size: 18px;
  font-weight: 700;
  color: #d9001d;
  display: block;
  margin-bottom: 10px;
}

.app-title {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.subtitle {
  color: #666;
  margin: 5px 0 0 0;
  font-size: 14px;
}

/* Formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

label {
  font-weight: 600;
  font-size: 14px;
  color: #444;
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #d9001d;
}

.btn-primary {
  background-color: #d9001d;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #b00016;
}

.btn-primary:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

/* Separador */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 25px 0;
  color: #999;
}

.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #eee;
}

.divider span {
  padding: 0 10px;
  font-size: 14px;
}

/* Google */
.google-section {
  text-align: center;
}

.google-hint {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.google-btn-wrapper {
  display: flex;
  justify-content: center;
}

/* Error */
.error-box {
  margin-top: 25px;
  padding: 12px;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #fecaca;
}
</style>