<script setup>
import { computed, onMounted, ref } from 'vue';

const idioma = useIdioma();
const haySesion = ref(false);

onMounted(() => {
  if (localStorage.getItem('user_centre')) {
    haySesion.value = true;
  }
});

const t = computed(() => {
  const textos = {
    ca: {
      breadcrumbs: 'Inici',
      titulo: 'Com fer la cerca per RALC?',
      subtitulo: 'Guia completa per buscar el pla individualitzat d\'un alumne',
      intro: "Per buscar el pla individualitzat d'un alumne a la nostra plataforma, necessites el seu codi RALC. Segueix aquesta guia pas a pas per completar la cerca correctament.",
      pas1_titulo: 'Entra a la secció de Cerca',
      pas1_desc: 'Des del menú principal, selecciona l\'opció "Cerca de Plans Individualitzats" o "Buscar Per RALC".',
      pas2_titulo: 'Localitza la barra de cerca',
      pas2_desc: 'Veuràs una barra de text prominent a la part esquerra de la pantalla amb l\'indicador "Introdueix el RALC de l\'alumne..."',
      pas3_titulo: 'Escriu el RALC',
      pas3_desc: 'Introdueix el codi RALC de l\'alumne que busques. Els resultats apareixen automàticament mentre escrius.',
      pas4_titulo: 'Selecciona l\'alumne',
      pas4_desc: 'Quan el sistema mostri els resultats, fes clic a l\'alumne que has trobat per accedir a la seva fitxa.',
      pas5_titulo: 'Accedeix al pla complet',
      pas5_desc: 'Un cop dins de la fitxa de l\'alumne, podràs visualitzar, descarregar o gestionar el seu pla individualitzat.',
      info_importante: 'Informació Important',
      info_p1: "El <strong>RALC</strong> és un codi únic que identifica cada alumne a Catalunya. Aquest codi és obligatori per fer la cerca correctament.",
      info_p2: "Si no coneixeu el RALC de l'alumne, consulteu amb la secretaria del vostre centre educatiu.",
      info_exemple: 'Exemple de RALC:',
      consells_utils: 'Consells Útils',
      consell1: '<strong>Sensibilitat:</strong> El RALC distingeix entre majúscules i minúscules. Verifica que l\'escrius correctament.',
      consell2: '<strong>Còpia exacta:</strong> Si copies el RALC, assegura\'t que no hi hagi espais al principi o al final.',
      consell3: '<strong>Cerca en temps real:</strong> Els resultats apareixen mentre escrius. No cal prémer cap botó.',
      consell4: '<strong>Sense resultats:</strong> Si no trobes l\'alumne, potser no té un pla registrat a la plataforma.',
      faq_titulo: 'Preguntes Freqüents',
      faq1_q: 'On puc trobar el RALC?',
      faq1_a: 'El RALC es troba a la documentació oficial de l\'alumne o a la secretaria del centre.',
      faq2_q: 'Puc cercar per nom?',
      faq2_a: 'No, la cerca és exclusivament per RALC per garantir la privacitat i precisió.',
      faq3_q: 'Què faig si no trobo l\'alumne?',
      faq3_a: 'Verifica el RALC. Si el problema persisteix, contacta amb suport tècnic.',
      btn_tornar: 'Tornar a la cerca'
    },
    es: {
      breadcrumbs: 'Inicio',
      titulo: '¿Cómo realizar la búsqueda por RALC?',
      subtitulo: 'Guía completa para buscar el plan individualizado de un alumno',
      intro: "Para buscar el plan individualizado de un alumno en nuestra plataforma, necesitas su código RALC. Sigue esta guía paso a paso para completar la búsqueda correctamente.",
      pas1_titulo: 'Entra en la sección de Búsqueda',
      pas1_desc: 'Desde el menú principal, selecciona la opción "Búsqueda de Planes Individualizados" o "Buscar Por RALC".',
      pas2_titulo: 'Localiza la barra de búsqueda',
      pas2_desc: 'Verás una barra de texto prominente en la parte izquierda de la pantalla con el marcador "Introduce el RALC del alumno..."',
      pas3_titulo: 'Escribe el RALC',
      pas3_desc: 'Introduce el código RALC del alumno que buscas. Los resultados aparecen automáticamente mientras escribes.',
      pas4_titulo: 'Selecciona el alumno',
      pas4_desc: 'Cuando el sistema muestre los resultados, haz clic en el alumno que has encontrado para acceder a su ficha.',
      pas5_titulo: 'Accede al plan completo',
      pas5_desc: 'Una vez dentro de la ficha del alumno, podrás visualizar, descargar o gestionar su plan individualizado.',
      info_importante: 'Información Importante',
      info_p1: "El <strong>RALC</strong> es un código único que identifica a cada alumno en Cataluña. Este código es obligatorio para realizar la búsqueda correctamente.",
      info_p2: "Si no conoces el RALC del alumno, consulta con la secretaría de tu centro educativo.",
      info_exemple: 'Ejemplo de RALC:',
      consells_utils: 'Consejos Útiles',
      consell1: '<strong>Sensibilidad:</strong> El RALC distingue entre mayúsculas y minúsculas. Verifica que lo escribes correctamente.',
      consell2: '<strong>Copia exacta:</strong> Si copias el RALC, asegúrate de que no haya espacios al principio o al final.',
      consell3: '<strong>Búsqueda en tiempo real:</strong> Los resultados aparecen mientras escribes. No es necesario pulsar ningún botón.',
      consell4: '<strong>Sin resultados:</strong> Si no encuentras al alumno, es posible que no tenga un plan registrado en la plataforma.',
      faq_titulo: 'Preguntas Frecuentes',
      faq1_q: '¿Dónde puedo encontrar el RALC?',
      faq1_a: 'El RALC se encuentra en la documentación oficial del alumno o en la secretaría del centro.',
      faq2_q: '¿Puedo buscar por nombre?',
      faq2_a: 'No, la búsqueda es exclusivamente por RALC para garantizar la privacidad y precisión.',
      faq3_q: '¿Qué hago si no encuentro al alumno?',
      faq3_a: 'Verifica el RALC. Si el problema persiste, contacta con soporte técnico.',
      btn_tornar: 'Volver a la búsqueda'
    },
    en: {
      breadcrumbs: 'Home',
      titulo: 'How to search by RALC?',
      subtitulo: 'Complete guide to search for a student\'s individualized plan',
      intro: "To search for a student's individualized plan on our platform, you need their RALC code. Follow this step-by-step guide to complete the search correctly.",
      pas1_titulo: 'Enter the Search section',
      pas1_desc: 'From the main menu, select the "Search for Individualized Plans" or "Search By RALC" option.',
      pas2_titulo: 'Locate the search bar',
      pas2_desc: 'You will see a prominent text bar on the left side of the screen with the placeholder "Enter the student\'s RALC..."',
      pas3_titulo: 'Type the RALC',
      pas3_desc: 'Enter the RALC code of the student you are looking for. The results appear automatically as you type.',
      pas4_titulo: 'Select the student',
      pas4_desc: 'When the system displays the results, click on the student you have found to access their file.',
      pas5_titulo: 'Access the full plan',
      pas5_desc: 'Once inside the student\'s file, you can view, download, or manage their individualized plan.',
      info_importante: 'Important Information',
      info_p1: "The <strong>RALC</strong> is a unique code that identifies each student in Catalonia. This code is mandatory to perform the search correctly.",
      info_p2: "If you do not know the student's RALC, consult the secretariat of your educational center.",
      info_exemple: 'RALC Example:',
      consells_utils: 'Useful Tips',
      consell1: '<strong>Sensitivity:</strong> The RALC is case-sensitive. Verify that you are typing it correctly.',
      consell2: '<strong>Exact copy:</strong> If you copy the RALC, make sure there are no spaces at the beginning or end.',
      consell3: '<strong>Real-time search:</strong> The results appear as you type. No need to press any button.',
      consell4: '<strong>No results:</strong> If you cannot find the student, they may not have a registered plan on the platform.',
      faq_titulo: 'Frequently Asked Questions',
      faq1_q: 'Where can I find the RALC?',
      faq1_a: 'The RALC is in the student\'s official documentation or at the school\'s office.',
      faq2_q: 'Can I search by name?',
      faq2_a: 'No, the search is exclusively by RALC to ensure privacy and accuracy.',
      faq3_q: 'What if I can\'t find the student?',
      faq3_a: 'Verify the RALC. If the problem persists, contact technical support.',
      btn_tornar: 'Back to search'
    }
  };
  return textos[idioma.value];
});
</script>

<template>
  <div class="page-container">
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

      <div class="info-text">
        <p>{{ t.intro }}</p>
      </div>

      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>{{ t.pas1_titulo }}</h3>
          <p>{{ t.pas1_desc }}</p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>{{ t.pas2_titulo }}</h3>
          <p>{{ t.pas2_desc }}</p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>{{ t.pas3_titulo }}</h3>
          <p>{{ t.pas3_desc }}</p>
        </div>
        <div class="step-card">
          <div class="step-number">4</div>
          <h3>{{ t.pas4_titulo }}</h3>
          <p>{{ t.pas4_desc }}</p>
        </div>
        <div class="step-card">
          <div class="step-number">5</div>
          <h3>{{ t.pas5_titulo }}</h3>
          <p>{{ t.pas5_desc }}</p>
        </div>
      </div>

      <div class="info-section">
        <h3>{{ t.info_importante }}</h3>
        <p v-html="t.info_p1"></p>
        <p>{{ t.info_p2 }}</p>
        <div class="example-box">
          <strong>{{ t.info_exemple }}</strong> 08001234XY
        </div>
      </div>

      <div class="tips-section">
        <h3>{{ t.consells_utils }}</h3>
        <ul>
          <li v-html="t.consell1"></li>
          <li v-html="t.consell2"></li>
          <li v-html="t.consell3"></li>
          <li v-html="t.consell4"></li>
        </ul>
      </div>

      <div class="faq-section">
        <h3>{{ t.faq_titulo }}</h3>
        <div class="faq-grid">
          <div class="faq-item">
            <h4>{{ t.faq1_q }}</h4>
            <p>{{ t.faq1_a }}</p>
          </div>
          <div class="faq-item">
            <h4>{{ t.faq2_q }}</h4>
            <p>{{ t.faq2_a }}</p>
          </div>
          <div class="faq-item">
            <h4>{{ t.faq3_q }}</h4>
            <p>{{ t.faq3_a }}</p>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <NuxtLink to="/pi/search" class="btn-back">← {{ t.btn_tornar }}</NuxtLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Estilos Genéricos de Página (similares a contacte.vue) */
.page-container { background-color: white; min-height: 100vh; padding: 20px; color: #333; }
.content-wrapper { max-width: 1000px; margin: 0 auto; padding-top: 20px; }
.breadcrumbs { font-size: 0.85rem; color: #666; margin-bottom: 20px; }
.breadcrumbs a { color: #333; text-decoration: underline; }
.separator { margin: 0 8px; }
.current { color: #666; }
.page-title { font-size: 2.2rem; font-weight: 400; margin: 0 0 15px 0; color: #333; }
.red-line { width: 50px; height: 4px; background-color: #D9001D; margin-bottom: 30px; }
.section-title { font-size: 1.8rem; font-weight: 300; color: #333; margin-bottom: 20px; }
.info-text { font-size: 1rem; line-height: 1.6; color: #444; margin-bottom: 40px; }

/* Estilos Específicos para la Guía */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}
.step-card {
  background-color: #f9f9f9;
  border-left: 4px solid #D9001D;
  padding: 25px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}
.step-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #D9001D;
  margin-bottom: 10px;
}
.step-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}
.step-card p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.info-section, .tips-section, .faq-section {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 30px;
  margin-bottom: 40px;
  border-top: 2px solid #eee;
}
.info-section h3, .tips-section h3, .faq-section h3 {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}
.info-section p, .tips-section ul, .faq-item p {
  font-size: 1rem;
  line-height: 1.7;
}
.example-box {
  background: white;
  border: 1px dashed #D9001D;
  border-radius: 4px;
  padding: 15px;
  margin-top: 20px;
  text-align: center;
  font-family: "Courier New", monospace;
  font-size: 1.1rem;
  color: #D9001D;
}
.tips-section ul {
  list-style-type: none;
  padding: 0;
}
.tips-section li {
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 10px;
  border-left: 3px solid #00899C;
}

.faq-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}
.faq-item {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
}
.faq-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}
.action-section {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.btn-back {
  display: inline-block;
  padding: 12px 28px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}
.btn-back:hover {
  background-color: #D9001D;
}
</style>