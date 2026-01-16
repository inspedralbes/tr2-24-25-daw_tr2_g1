<script setup>
import { useRouter } from "vue-router";

const idioma = useIdioma();
const router = useRouter();
const centre = ref(null);

const t = computed(() => {
  const textos = {
    ca: {
      bienvenida: "Benvingut/da",
      intro:
        "Aquesta eina permet agilitzar la creació i gestió dels PIs mitjançant intel·ligència artificial. Selecciona una de les opcions següents per començar:",
      opcion_pi: "Crear Nou PI",
      desc_pi: "Iniciar un nou tràmit d'alumne (Opció A).",
      opcion_form: "Cercar Alumne",
      desc_form: "Accés al formulari temporal (Form Page).",
    },
    es: {
      bienvenida: "Bienvenido/a",
      intro:
        "Esta herramienta permite agilizar la creación y gestión de los PIs mediante inteligencia artificial. Selecciona una de las siguientes opciones para empezar:",
      opcion_pi: "Crear Nuevo PI",
      desc_pi: "Iniciar un nuevo trámite de alumno (Opción A).",
      opcion_form: "Formulario de Prueba",
      desc_form: "Acceso al formulario temporal (Form Page).",
    },
    en: {
      bienvenida: "Welcome",
      intro:
        "This tool streamlines the creation and management of IPs using artificial intelligence. Select one of the following options to start:",
      opcion_pi: "Create New IP",
      desc_pi: "Start a new student process (Option A).",
      opcion_form: "Test Form",
      desc_form: "Access to temporary form (Form Page).",
    },
  };
  return textos[idioma.value];
});

onMounted(() => {
  const savedCentre = localStorage.getItem("user_centre");
  if (!savedCentre) {
    router.push("/");
  } else {
    centre.value = JSON.parse(savedCentre);
  }
});
</script>

<template>
  <div class="main-content">
    <div class="container">
      <section class="intro" v-if="centre">
        <div class="header-row">
          <h1>
            {{ t.bienvenida }}, <span class="highlight">{{ centre.nom }}</span>
          </h1>
        </div>

        <p class="subtitle">{{ t.intro }}</p>
      </section>

      <div v-else class="loading">Carregant...</div>

      <div class="grid-opciones">
        <NuxtLink to="/pi/crear-pi" class="card-gencat">
          <div class="text-card">
            <h3>{{ t.opcion_pi }}</h3>
            <p>{{ t.desc_pi }}</p>
          </div>
          <div class="arrow">→</div>
        </NuxtLink>

        <NuxtLink to="/pi/search" class="card-gencat">
          <div class="text-card">
            <h3>{{ t.opcion_form }}</h3>
            <p>{{ t.desc_form }}</p>
          </div>
          <div class="arrow">→</div>
        </NuxtLink>

        <NuxtLink to="/pi/crear-pi-def" class="card-gencat">
          <div class="text-card">
            <h3>En proceso</h3>

            <p>{{ t.desc_pi }}</p>
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
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
}
.intro h1 {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.2;
}
.highlight {
  color: #d00000;
}

.subtitle {
  font-family: "Open Sans", sans-serif;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.card-gencat:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
