<script setup>
// 1. Definimos la variable FUERA para que todos la vean
const step = ref(1);

function nextStep() {
  if (step.value < 3) step.value++;
}
function previousStep() {
  if (step.value > 1) step.value--;
}
</script>

<template>
  <div class="steps-indicator">
    <span :class="{ active: step === 1 }">1. Dades i Documentació</span>
    <span class="separator">/</span>
    <span :class="{ active: step === 2 }">2. Anàlisi i Revisió</span>
    <span class="separator">/</span>
    <span :class="{ active: step === 3 }">3. Revisió i Descarga</span>
  </div>

  <hr />

  <div v-if="step === 1">
    <RegisterStudent /> <br />
    <!-- <button @click="nextStep">Ir al Paso 2</button> -->
  </div>

  <div v-if="step === 2">
    <!-- Aquí iría el contenido del análisis... -->
  </div>

  <div v-if="step === 3">
    <!-- aquí iría el contenido de revisión y descarga... -->
  </div>
</template>

<style scoped>
/* TUS ESTILOS (Estaban perfectos) */
.steps-indicator {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}
.steps-indicator .active {
  color: #d00000;
  font-weight: 600;
}
.steps-indicator .separator {
  margin: 0 10px;
}
</style>
