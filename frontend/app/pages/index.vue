<script setup>
import { useRouter } from "vue-router";

// 1. Importamos el idioma global
const idioma = useIdioma();
const router = useRouter();

const email = ref("");
const errorMessage = ref("");
const loading = ref(false);

// 2. DICCIONARIO DE TRADUCCIONS LOGIN
const t = computed(() => {
  const textos = {
    ca: {
      subtitle: "Accés per a Centres Educatius",
      label_email: "Correu electrònic (xtec)",
      btn_entrar: "Entrar",
      btn_loading: "Entrant...",
      footer: "© Generalitat de Catalunya",
      error_connexio: "Error de connexió amb el servidor",
    },
    es: {
      subtitle: "Acceso para Centros Educativos",
      label_email: "Correo electrónico (xtec)",
      btn_entrar: "Entrar",
      btn_loading: "Entrando...",
      footer: "© Generalitat de Catalunya",
      error_connexio: "Error de conexión con el servidor",
    },
    en: {
      subtitle: "Access for Educational Centers",
      label_email: "Email address (xtec)",
      btn_entrar: "Log In",
      btn_loading: "Logging in...",
      footer: "© Generalitat de Catalunya",
      error_connexio: "Connection error with server",
    },
  };
  return textos[idioma.value];
});

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    loading.value = true;
    errorMessage.value = "";
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("user_centre", JSON.stringify(data.centre));
      router.push("/home");
    } else {
      if (data.error && typeof data.error === "string") {
        errorMessage.value = data.error;
      } else {
        errorMessage.value = "Correu incorrecte o accés denegat.";
      }
      // Si el backend devuelve un error, lo mostramos tal cual}
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = t.value.error_connexio;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <!-- Contenido principal de la página login -->

  <div class="glass-bg">
    <div class="login-card">
      <div class="card-header">
        <h1>PlaPI</h1>
      </div>

      <p class="subtitle">{{ t.subtitle }}</p>

      <form @submit.prevent="handleLogin">
        <div class="input-wrap">
          <input
            type="email"
            v-model="email"
            placeholder=" "
            required
            id="email-input"
          />
          <label for="email-input">{{ t.label_email }}</label>
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? t.btn_loading : t.btn_entrar }}
        </button>
      </form>

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

/* ELIMINADO EL ESTILO .logo-circle PORQUE YA NO SE USA */

h1 {
  margin: 0 0 10px 0; /* Un poco de margen abajo */
  color: #d9001d;
  font-weight: 800;
  letter-spacing: -1px;
  font-size: 2.5rem; /* He hecho el título un pelín más grande al quitar el logo */
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 0.9rem;
}

/* Input y Labels */
.input-wrap {
  position: relative;
  margin-bottom: 20px;
  text-align: left;
}

.input-wrap input {
  width: 100%;
  padding: 15px;
  border: 1px solid #cdd4dc;
  border-radius: 8px;
  font-size: 1rem;
  background: #f9f9f9;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s;
}

.input-wrap input:focus {
  background: white;
  border-color: #d9001d;
  box-shadow: 0 0 0 4px rgba(217, 0, 29, 0.1);
}

.input-wrap label {
  position: absolute;
  left: 15px;
  top: 16px;
  color: #888;
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
  color: #d9001d;
  font-weight: bold;
}

.btn-primary {
  width: 100%;
  padding: 15px;
  background: #d9001d;
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
  color: #d9001d;
  font-size: 0.85rem;
  margin-bottom: 15px;
  background-color: #fff5f5;
  padding: 5px;
  border-radius: 4px;
}

.footer-links {
  margin-top: 30px;
  font-size: 0.75rem;
  color: #888;
}
</style>
