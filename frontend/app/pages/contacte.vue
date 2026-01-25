<script setup>
// ============================================
// PÁGINA: Contacto e Información de Soporte
// ============================================
// Página informativa con contactos para soporte técnico
// Muestra diferentes canales según el tipo de consulta
import { computed, onMounted, ref } from 'vue';

const idioma = useIdioma();
const haySesion = ref(false);

// Verificar si hay sesión para mostrar breadcrumbs
onMounted(() => {
  if (localStorage.getItem('user_centre')) {
    haySesion.value = true;
  }
});

// ============================================
// TRADUCCIONES: Catalán, Español, Inglés
// ============================================
const t = computed(() => {
  const textos = {
    ca: {
      breadcrumbs: 'Inici',
      titulo: 'Contacte',
      subtitulo: 'Com contactar en cas de dubtes i/o incidències',
      intro: "En funció del tipus d'informació que necessiteu, teniu diverses maneres de contactar:",
      dubtes_disseny: 'Per dubtes relacionats amb el **disseny** (plantilles, estructura...):',
      dubtes_dev: 'Per dubtes relacionats amb el **desenvolupament**:',
      dubtes_incidencia: 'Per dubtes i/o incidències amb **EduPI**:',
      data: "Data d'actualització"
    },
    es: {
      breadcrumbs: 'Inicio',
      titulo: 'Contacto',
      subtitulo: 'Cómo contactar en caso de dudas y/o incidencias',
      intro: "En función del tipo de información que necesitéis, tenéis diversas maneras de contactar:",
      dubtes_disseny: 'Para dudas relacionadas con el **diseño** (plantillas, estructura...):',
      dubtes_dev: 'Para dudas relacionadas con el **desarrollo**:',
      dubtes_incidencia: 'Para dudas y/o incidencias con **EduPI**:',
      data: "Fecha de actualización"
    },
    en: {
      breadcrumbs: 'Home',
      titulo: 'Contact',
      subtitulo: 'How to contact in case of doubts and/or incidents',
      intro: "Depending on the type of information you need, there are several ways to contact:",
      dubtes_disseny: 'For questions related to **design** (templates, structure...):',
      dubtes_dev: 'For questions related to **development**:',
      dubtes_incidencia: 'For questions and/or incidents with **EduPI**:',
      data: "Last updated"
    }
  };
  return textos[idioma.value];
});
</script>

<template>
  <div class="contact-container">
    <div class="content-wrapper">
      
      <div class="breadcrumbs" v-if="haySesion">
        <NuxtLink to="/home">{{ t.breadcrumbs }}</NuxtLink> 
        <span class="separator">></span> 
        <span class="current">{{ t.titulo }}</span>
      </div>
      <div v-else style="margin-bottom: 20px;"></div>

      <h1 class="page-title">{{ t.titulo }}</h1>
      <div class="red-line"></div>

      <h2 class="section-title">{{ t.subtitulo }}</h2>

      <div class="icons-grid">
        <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg></div>
        <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
        <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
        <div class="icon-circle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
      </div>

      <div class="info-text">
        <p>{{ t.intro }}</p>
        
        <ul>
          <li><span v-html="t.dubtes_disseny.replace('**', '<strong>').replace('**', '</strong>')"></span> <a href="mailto:webs@gencat.cat" class="link-gencat">webs@gencat.cat</a>.</li>
          <li><span v-html="t.dubtes_dev.replace('**', '<strong>').replace('**', '</strong>')"></span> <a href="#" class="link-gencat">Qualitat i Models TI</a>.</li>
          <li><span v-html="t.dubtes_incidencia.replace('**', '<strong>').replace('**', '</strong>')"></span> <a href="#" class="link-gencat">SAU (Remedy)</a>.</li>
        </ul>

        <div class="update-date">{{ t.data }}: 12.01.2026</div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.contact-container { background-color: white; min-height: 100vh; padding: 20px; color: #333; }
.content-wrapper { max-width: 1000px; margin: 0 auto; padding-top: 20px; }
.breadcrumbs { font-size: 0.85rem; color: #666; margin-bottom: 20px; }
.breadcrumbs a { color: #333; text-decoration: underline; }
.separator { margin: 0 8px; }
.current { color: #666; }
.page-title { font-size: 2.2rem; font-weight: 400; margin: 0 0 15px 0; color: #333; }
.red-line { width: 50px; height: 4px; background-color: #D9001D; margin-bottom: 30px; }
.section-title { font-size: 1.8rem; font-weight: 300; color: #333; margin-bottom: 40px; }
.icons-grid { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; margin-bottom: 50px; }
.icon-circle { width: 160px; height: 160px; background-color: #00899C; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
.icon-circle:hover { transform: scale(1.05); background-color: #007a8a; }
.icon-circle svg { width: 80px; height: 80px; stroke: white; stroke-width: 1.5; }
.info-text { font-size: 1rem; line-height: 1.6; color: #444; }
.info-text ul { list-style-type: disc; padding-left: 20px; margin-top: 20px; }
.info-text li { margin-bottom: 12px; }
.link-gencat { color: #D9001D; text-decoration: underline; cursor: pointer; }
.link-gencat:hover { text-decoration: none; }
.update-date { text-align: right; font-size: 0.85rem; color: #888; margin-top: 50px; border-top: 1px solid #eee; padding-top: 10px; }
@media (max-width: 768px) { .icon-circle { width: 100px; height: 100px; } .icon-circle svg { width: 50px; height: 50px; } }
</style>