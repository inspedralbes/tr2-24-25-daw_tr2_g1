<template>
  <div class="guide-page">
    <!-- Encabezado -->
    <div class="header-section">
      <p class="gencat-brand">gencat.cat</p>
      <h1 class="main-title">Com fer la cerca per RALC?</h1>
      <p class="subtitle">Guia completa per buscar el pla individualitzat d'un alumne</p>
    </div>

    <!-- Contenedor principal -->
    <div class="container">
      <!-- Introducción -->
      <p class="intro-text">
        Per buscar el pla individualitzat d'un alumne dins de la nostra plataforma, necessites el seu codi RALC. 
        Segueix aquesta guia pas a pas per completar la cerca de manera correcta.
      </p>

      <!-- 5 Pasos -->
      <section class="steps-section">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Entra a la secció de Cerca</h3>
          <p>Desde el menú principal, selecciona l'opció "Cerca de Plans Individualitzats" o "Buscar Per RALC".</p>
        </div>

        <div class="step-card">
          <div class="step-number">2</div>
          <h3>Localitza la barra de cerca</h3>
          <p>Veuràs una barra de text prominent a la part esquerra de la pantalla amb el placeholder "Introdueix el RALC de l'alumne..."</p>
        </div>

        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Escriu el RALC</h3>
          <p>Introdueix el codi RALC de l'alumne que busques. Els resultats apareixen automàticament mentre escrius.</p>
        </div>

        <div class="step-card">
          <div class="step-number">4</div>
          <h3>Selecciona l'alumne</h3>
          <p>Quan el sistema mostra els resultats, fes clic a l'alumne que has trobat per accedir a la seva fitxa.</p>
        </div>

        <div class="step-card">
          <div class="step-number">5</div>
          <h3>Accedeix al pla complet</h3>
          <p>Un cop dins de la fitxa de l'alumne, podràs visualitzar, descarregar o gestionar el seu pla individualitzat.</p>
        </div>
      </section>

      <!-- Información importante -->
      <section class="info-section">
        <h2>ℹ Informació Important</h2>
        <p>
          El <strong>RALC</strong> és un codi únic de 8-10 caràcters que identifica cada alumne a Catalunya. 
          Aquest codi és obligatori per fer la cerca correctament.
        </p>
        <p>Si no coneixeu el RALC de l'alumne, consulteu amb la secretaria del vostre centre educatiu.</p>
        <div class="example-box">
          <strong>Exemple de RALC:</strong> 08001234XY
        </div>
      </section>

      <!-- Tips/Consells -->
      <section class="tips-section">
        <h2>💡 Consells Útils</h2>
        <ul class="tips-list">
          <li><strong>Sensibilitat:</strong> El RALC és sensible a majúscules i minúscules. Verifica que l'escrius correctament.</li>
          <li><strong>Copia exacta:</strong> Si copies el RALC d'una font, assegura't que no hi hagi espais al principi o final.</li>
          <li><strong>Cerca en temps real:</strong> Els resultats apareixen mentre escribs. No cal prémer cap botó de cerca.</li>
          <li><strong>Sense resultats:</strong> Si no trobes l'alumne, és possible que no tingui un pla registrat a la plataforma.</li>
        </ul>
      </section>

      <!-- Preguntes Freqüents -->
      <section class="faq-section">
        <h2> Preguntes Freqüents</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h4>On puc trobar el RALC?</h4>
            <p>El RALC està en la documentació oficial de l'alumne, en el carnet d'estudiant o pots consultar-lo a la secretaria del centre.</p>
          </div>
          <div class="faq-item">
            <h4>Puc cercar per nom de l'alumne?</h4>
            <p>No. La cerca es realitza exclusivament per RALC per assegurar la privacitat i precisió de les dades.</p>
          </div>
          <div class="faq-item">
            <h4>Què faig si no trobo l'alumne?</h4>
            <p>Verifica bé el RALC i que l'alumne tingui un pla registrat. Si els problemes persisten, contacta amb suport tècnic.</p>
          </div>
          <div class="faq-item">
            <h4>Puc buscar múltiples alumnes?</h4>
            <p>Sí. Pots buscar tants alumnes com vulguis. Simplement esborra el RALC anterior i introdueix un de nou.</p>
          </div>
          <div class="faq-item">
            <h4>Els resultats es guarden?</h4>
            <p>Cada cerca és independent. Els resultats anteriors no es mantenen, però l'historial de searches pot estar disponible.</p>
          </div>
          <div class="faq-item">
            <h4>Quins permisos necessito?</h4>
            <p>Has d'estar autenticat com a centre educatiu per poder fer cerques de plans individualitzats.</p>
          </div>
        </div>
      </section>

      <!-- Botó retorn -->
      <div class="action-section">
        <NuxtLink to="/pi/search" class="btn-back">← Tornar a la cerca</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.guide-page {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  min-height: calc(100vh - 140px);
  padding: 40px 20px;
}

/* ===== ENCABEZADO ===== */
.header-section {
  background: white;
  padding: 45px;
  margin-bottom: 45px;
  border-bottom: 4px solid #d00000;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.gencat-brand {
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #d00000;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 15px 0;
}

.main-title {
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
  font-size: 42px;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.subtitle {
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* ===== CONTENEDOR PRINCIPAL ===== */
.container {
  max-width: 1100px;
  margin: 0 auto;
}

.intro-text {
  background: white;
  padding: 25px;
  border-left: 5px solid #d00000;
  border-radius: 6px;
  margin-bottom: 45px;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  color: #555;
  line-height: 1.8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ===== GRID DE 5 PASOS ===== */
.steps-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.step-card {
  background: white;
  padding: 30px 25px;
  border-radius: 6px;
  border-left: 5px solid #d00000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.step-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background-color: #d00000;
  color: white;
  border-radius: 50%;
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 15px;
}

.step-card h3 {
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.step-card p {
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.7;
  flex-grow: 1;
}

/* ===== SECCIÓN INFORMACIÓN IMPORTANTE ===== */
.info-section {
  background: linear-gradient(135deg, #fff5f5 0%, #fff9f9 100%);
  border-left: 5px solid #d00000;
  border-radius: 6px;
  padding: 35px;
  margin-bottom: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.info-section h2 {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: #333;
  margin: 0 0 18px 0;
}

.info-section p {
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  color: #555;
  margin: 0 0 15px 0;
  line-height: 1.8;
}

.info-section p:last-of-type {
  margin-bottom: 20px;
}

.example-box {
  background: white;
  border: 2px dashed #d00000;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
  font-family: "Courier New", monospace;
  font-size: 15px;
  color: #d00000;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ===== SECCIÓN TIPS ===== */
.tips-section {
  background: white;
  padding: 35px;
  border-radius: 6px;
  border-top: 4px solid #007a33;
  margin-bottom: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.tips-section h2 {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: #333;
  margin: 0 0 25px 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 18px;
}

.tips-list li {
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  padding: 16px;
  background: #f9f9f9;
  border-left: 4px solid #007a33;
  border-radius: 4px;
}

.tips-list strong {
  color: #333;
  display: block;
  margin-bottom: 4px;
}

/* ===== SECCIÓN FAQ ===== */
.faq-section {
  background: white;
  padding: 35px;
  border-radius: 6px;
  border-bottom: 4px solid #d00000;
  margin-bottom: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.faq-section h2 {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: #333;
  margin: 0 0 25px 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.faq-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 6px;
  border-left: 4px solid #d00000;
}

.faq-item h4 {
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: #333;
  margin: 0 0 10px 0;
}

.faq-item p {
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.7;
}

/* ===== SECCIÓN ACCIONES ===== */
.action-section {
  display: flex;
  justify-content: center;
  padding: 35px 0;
  border-top: 1px solid #ddd;
}

.btn-back {
  display: inline-block;
  padding: 14px 32px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #333;
  cursor: pointer;
}

.btn-back:hover {
  background-color: #555;
  border-color: #555;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .guide-page {
    padding: 25px 15px;
  }

  .header-section {
    padding: 30px 20px;
    margin-bottom: 30px;
  }

  .main-title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }

  .steps-section {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 35px;
  }

  .step-card {
    padding: 20px;
  }

  .info-section,
  .tips-section,
  .faq-section {
    padding: 20px;
    margin-bottom: 35px;
  }

  .info-section h2,
  .tips-section h2,
  .faq-section h2 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .tips-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .faq-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 24px;
  }

  .header-section {
    padding: 20px 15px;
  }

  .step-number {
    width: 38px;
    height: 38px;
    font-size: 16px;
  }

  .example-box {
    font-size: 13px;
    padding: 12px;
  }
}
</style>
