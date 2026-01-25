<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";

// ID DE CLIENTE
const GOOGLE_CLIENT_ID = "182669171058-e7grkc62veee2a4t7k00dfqb450vo6j3.apps.googleusercontent.com";

const idioma = useIdioma(); // Asumo que tienes este composable
const router = useRouter();

const errorMessage = ref("");
const loading = ref(false);

// Traducciones
const t = computed(() => {
  const textos = {
    ca: {
      subtitle: "Accés per a Centres Educatius",
      btn_loading: "Validant...",
      footer: "© Generalitat de Catalunya",
      error_connexio: "Error de connexió amb el servidor",
      error_no_centre: "Aquest correu no pertany a cap centre registrat.",
      error_generic: "No s'ha pogut iniciar sessió."
    },
    es: {
      subtitle: "Acceso para Centros Educativos",
      btn_loading: "Validando...",
      footer: "© Generalitat de Catalunya",
      error_connexio: "Error de conexión con el servidor",
      error_no_centre: "Este correo no pertenece a ningún centro registrado.",
      error_generic: "No se pudo iniciar sesión."
    },
    en: {
      subtitle: "Access for Educational Centers",
      btn_loading: "Validating...",
      footer: "© Generalitat de Catalunya",
      error_connexio: "Connection error with server",
      error_no_centre: "This email does not belong to any registered center.",
      error_generic: "Could not login."
    },
  };
  return textos[idioma.value] || textos.ca;
});

// Respuesta de Google
const handleGoogleResponse = async (response) => {
  loading.value = true;
  errorMessage.value = "";

  try {
    // Usamos el puerto 3000 porque el Backend está ahí
    const { API_URL } = await import('../config/api.js');
    const baseURL = API_URL;
    
    // Enviamos el token al backend para que verifique contra la DB
    const res = await fetch(`${baseURL}/api/login-google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: response.credential }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Login correcto: Guardamos datos y redirigimos
      localStorage.setItem('user_centre', JSON.stringify(data.centre));
      router.push('/home');
    } else {
      // Errores controlados (404, etc)
      if (res.status === 404) {
        errorMessage.value = t.value.error_no_centre;
      } else {
        errorMessage.value = data.error || t.value.error_generic;
      }
    }
  } catch (err) {
    console.error(err);
    errorMessage.value = t.value.error_connexio;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Función recursiva para asegurar que el botón se pinta cuando Google carga
  const renderGoogleButton = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: false
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: 320, locale: idioma.value }
      );
    } else {
      // Si el script aun no ha bajado, reintentamos en 200ms
      setTimeout(renderGoogleButton, 200);
    }
  };

  renderGoogleButton();
});
</script>

<template>
  <div class="glass-bg">
    <div class="login-card">
      <div class="card-header">
        <h1>EduPI</h1>
      </div>

      <p class="subtitle">{{ t.subtitle }}</p>

      <div class="login-container">
        <div id="google-signin-button" class="google-btn-wrapper"></div>
        
        <div v-if="loading" class="loading-state">
          <p>{{ t.btn_loading }}</p>
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
      </div>

      <div class="footer-links">
        <span>{{ t.footer }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-bg {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8vh;
  background-color: #e8ecf1;
  background-image: radial-gradient(#c5cdd8 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

.login-card {
  background: white;
  padding: 50px 40px;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  border: 1px solid #dce1e6;
  width: 100%;
  max-width: 380px;
  text-align: center;
}

h1 {
  margin: 0 0 10px 0;
  color: #d9001d;
  font-weight: 800;
  letter-spacing: -1px;
  font-size: 2.5rem;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: 80px;
}

.google-btn-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 45px; /* Evita saltos de layout */
}

.loading-state {
  color: #666;
  font-size: 0.9rem;
}

.error-msg {
  color: #d9001d;
  font-size: 0.85rem;
  background-color: #fff5f5;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
}

.footer-links {
  margin-top: 30px;
  font-size: 0.75rem;
  color: #888;
}
</style>