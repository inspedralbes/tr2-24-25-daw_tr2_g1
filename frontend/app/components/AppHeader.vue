<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const idioma = useIdioma();
const route = useRoute();
const router = useRouter();
const estaLogueado = ref(false);
const cercadorObert = ref(false); 
const textBusqueda = ref(''); 

// --- LÓGICA DE SESIÓN ---
const checkLogin = () => {
  if (typeof window !== 'undefined') {
    estaLogueado.value = !!localStorage.getItem('user_centre');
  }
};
watch(() => route.path, checkLogin);
onMounted(checkLogin);

// --- LÓGICA DEL BUSCADOR ---
const toggleCercador = () => {
  cercadorObert.value = !cercadorObert.value;
  if (!cercadorObert.value) textBusqueda.value = '';
};

const realizarBusqueda = () => {
  console.log("Buscando:", textBusqueda.value);
};

// --- IDIOMAS ---
const cambiarIdioma = (nuevoIdioma) => {
  idioma.value = nuevoIdioma;
  const checkbox = document.getElementById('check-idioma');
  if (checkbox) checkbox.checked = false;
};

// Acciones del botón derecho (Login/Logout)
const accionBoton = () => {
  if (estaLogueado.value) {
    localStorage.removeItem('user_centre');
  }
  router.push('/');
};

// --- TRADUCCIONES Y DATOS ---
const t = computed(() => {
  const i = idioma.value;
  return {
    tancar_sessio: { ca: 'Tancar Sessió', es: 'Cerrar Sesión', en: 'Log Out' }[i],
    iniciar_sessio: { ca: 'Iniciar Sessió', es: 'Iniciar Sesión', en: 'Log In' }[i],
    cercador_titulo: { ca: 'Cercador', es: 'Buscador', en: 'Search' }[i],
    placeholder: { ca: 'Pots cercar tràmits, departaments, serveis...', es: 'Puedes buscar trámites, departamentos, servicios...', en: 'Search procedures, departments, services...' }[i],
    
    // AQUÍ ESTÁN TODOS LOS ENLACES Y TEXTOS ACTUALIZADOS
    chips: [
      { 
        label: { ca: 'Novetats de GECO+', es: 'Novedades de GECO+', en: 'GECO+ News' },
        url: 'https://guiaweb.gencat.cat/ca/suport-als-usuaris-gecoplus/actualitat/' 
      },
      { 
        label: { ca: 'Icones i botons', es: 'Iconos y botones', en: 'Icons and buttons' },
        url: 'https://guiaweb.gencat.cat/ca/disseny-grafic/icones-i-botons/' 
      },
      { 
        label: { ca: 'Plantilla base', es: 'Plantilla base', en: 'Base template' },
        url: 'https://guiaweb.gencat.cat/ca/estructura/plantilles/plantilla-base/' 
      },
      { 
        // CAMBIO: AÑADIDO "de GECO+"
        label: { ca: 'Manuals i tutorials de GECO+', es: 'Manuales y tutoriales de GECO+', en: 'GECO+ Manuals and tutorials' },
        url: 'https://guiaweb.gencat.cat/ca/suport-als-usuaris-gecoplus/manuals/' 
      },
      { 
        label: { ca: 'Taules', es: 'Tablas', en: 'Tables' },
        url: 'https://guiaweb.gencat.cat/ca/cataleg/taules/' 
      },
      { 
        label: { ca: 'Especificacions tècniques', es: 'Especificaciones técnicas', en: 'Technical specifications' },
        url: 'https://guiaweb.gencat.cat/ca/desenvolupament/especificacions-tecniques/' 
      }
    ]
  };
});

const tituloDinamico = computed(() => {
  const ruta = route.path;
  const textoBase = { ca: 'Traspàs Plans Individualitzats', es: 'Traspaso Planes Individualizados', en: 'Individual Plans Transfer' };
  const titulos = {
    '/': textoBase,
    '/home': textoBase,
    '/contacte': { ca: 'Contacte', es: 'Contacto', en: 'Contact' },
    '/temporal/formPage': { ca: 'Registrar Nou PI', es: 'Registrar Nuevo PI', en: 'Register New IP' },
    '/pi/new': { ca: 'Crear PI', es: 'Crear PI', en: 'Create IP' },
  };
  return titulos[ruta] ? titulos[ruta][idioma.value] : 'PlaPI - Generalitat de Catalunya';
});

const menuItems = [{ nombre: 'Inici', path: '/home' }];
const esLogin = computed(() => route.path === '/');
const ocultarMenu = computed(() => route.path === '/' || route.path === '/contacte' || route.path === '/home');

</script>

<template>
  <header>
    <div class="top-bar">
      <div class="container">
        <NuxtLink to="/" class="logo-link">
          <img src="/gencat_logo.svg" alt="Generalitat de Catalunya" class="logo-img">
        </NuxtLink>

        <nav class="top-nav">
          <NuxtLink to="/contacte" class="menu-link">Contacte</NuxtLink>
          <span>|</span>
          <div class="selector-idioma">
            <input type="checkbox" id="check-idioma" />
            <label for="check-idioma" class="boton-ca">{{ idioma.toUpperCase() }} ▾</label>
            <div class="desplegable">
              <button @click="cambiarIdioma('ca')">Català (CA)</button>
              <button @click="cambiarIdioma('es')">Castellano (ES)</button>
              <button @click="cambiarIdioma('en')">English (EN)</button>
            </div>
          </div>
          <span>|</span>
          <button @click="toggleCercador" class="search-btn-toggle">
            <span v-if="cercadorObert" class="icon-close">✕</span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </nav>
      </div>
    </div>

    <div v-if="cercadorObert" class="search-panel">
      <div class="container-column">
        <h2>{{ t.cercador_titulo }}</h2>
        
        <div class="search-input-wrapper">
          <input 
            type="text" 
            v-model="textBusqueda" 
            :placeholder="t.placeholder" 
            @keyup.enter="realizarBusqueda"
          />
          <button class="btn-search-action" @click="realizarBusqueda">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <div class="chips-container">
          <a 
            v-for="(chip, index) in t.chips" 
            :key="index" 
            :href="chip.url" 
            target="_blank"
            class="chip"
          >
            {{ chip.label[idioma] }}
          </a>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="main-nav-bar">
        <div class="container container-header-gris">
          <h1 class="site-title">{{ tituloDinamico }}</h1>
          <button v-if="!esLogin" @click="accionBoton" class="btn-logout-header">
            {{ estaLogueado ? t.tancar_sessio : t.iniciar_sessio }}
            <span v-if="estaLogueado" class="icon-x">✕</span>
            <span v-else class="icon-x">→</span>
          </button>
        </div>
      </div>

      <div class="bottom-nav-bar" v-if="!ocultarMenu && menuItems.length > 0">
        <div class="container">
          <nav class="main-nav">
            <template v-for="(item, index) in menuItems" :key="item.nombre">
              <NuxtLink :to="item.path" class="nav-item">{{ item.nombre }}</NuxtLink>
              <span v-if="index < menuItems.length - 1" class="sep-menu">|</span>
            </template>
          </nav>
        </div>
      </div>
    </template>

  </header>
</template>

<style scoped>
header { width: 100%; display: block; position: relative; }
.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 30px; display: flex; align-items: center; box-sizing: border-box; }

/* CAMBIO: AUMENTADO EL ANCHO MÁXIMO PARA QUE QUEPAN LOS BOTONES EN UNA LÍNEA */
.container-column { 
  width: 100%; 
  max-width: 1200px; /* Antes era 900px */
  margin: 0 auto; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  padding: 0 20px; 
}

/* TOP BAR */
.top-bar { background-color: #333333; color: white; font-size: 14px; padding: 12px 0; width: 100%; }
.top-bar .container { justify-content: space-between; }
.logo-img { height: 35px; width: auto; }
.top-nav { display: flex; align-items: center; }
.menu-link { color: white; text-decoration: none; cursor: pointer; margin-right: 15px; }
.menu-link:hover { text-decoration: underline; text-underline-offset: 4px; }
.top-nav span { margin: 0 10px; color: #666; }

/* IDIOMA */
.selector-idioma { position: relative; }
#check-idioma { display: none; }
.boton-ca { cursor: pointer; user-select: none; color: white; font-weight: bold; }
.desplegable { display: none; position: absolute; top: 30px; left: -20px; background: white; min-width: 150px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); z-index: 999; border-top: 2px solid #d00000; }
#check-idioma:checked ~ .desplegable { display: block; }
.desplegable button { background: none; border: none; width: 100%; text-align: left; color: #333; display: block; padding: 10px 15px; cursor: pointer; }
.desplegable button:hover { background-color: #f0f0f0; color: #d00000; }

/* BOTÓN LUPA */
.search-btn-toggle { background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; }
.icon-close { font-size: 20px; font-weight: bold; }

/* SEARCH PANEL */
.search-panel {
  background-color: #f7f7f7;
  padding: 40px 0 60px 0;
  width: 100%;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.search-panel h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 25px;
  font-weight: 700;
}

.search-input-wrapper {
  display: flex;
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
}

.search-input-wrapper input {
  flex-grow: 1;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 4px 0 0 4px;
  outline: none;
}
.search-input-wrapper input:focus { border-color: #999; }

.btn-search-action {
  background-color: #D00000;
  border: none;
  width: 60px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 4px 4px 0;
  transition: background 0.3s;
}
.btn-search-action:hover { background-color: #a00000; }

/* CHIPS */
.chips-container {
  display: flex;
  flex-wrap: wrap; /* Mantenemos wrap por si la pantalla es muy pequeña (móvil), pero en PC se verán en línea */
  gap: 10px;
  justify-content: center;
}

.chip {
  background-color: white;
  border: 1px solid #D00000;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  text-decoration: none; 
  display: inline-block;
  white-space: nowrap; /* Evita que el texto dentro del botón se rompa */
}

.chip:hover {
  background-color: #D00000;
  color: white;
}

/* OTROS ESTILOS */
.main-nav-bar { background-color: #444444; color: white; padding: 15px 0; width: 100%; }
.site-title { margin: 0; font-size: 20px; font-weight: normal; }
.container-header-gris { justify-content: space-between; }

.btn-logout-header {
  background-color: transparent; border: 1px solid rgba(255, 255, 255, 0.4);
  color: white; padding: 6px 14px; border-radius: 4px; font-size: 13px;
  cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
}
.btn-logout-header:hover { background-color: rgba(255, 255, 255, 0.1); border-color: white; }
.icon-x { font-size: 12px; font-weight: bold; }

.bottom-nav-bar { background-color: white; border-bottom: 1px solid #e0e0e0; font-size: 14px; width: 100%; }
.main-nav { display: flex; align-items: center; width: 100%; }
.nav-item { text-decoration: none; color: #333; padding: 15px 0; border-bottom: 3px solid transparent; transition: all 0.2s ease; }
.nav-item:hover, .nav-item.router-link-active { color: #d00000; font-weight: 700; }
.sep-menu { color: #ccc; margin: 0 15px; user-select: none; }
</style>