<!-- ============================================
  LAYOUT POR DEFECTO
  ============================================
  Layout principal de la aplicación
  Incluye el header en todas las páginas y un slot para el contenido
-->
<script setup>
const demoMode = useRuntimeConfig().public.demoMode;
</script>
<template>
  <div>
    <!-- Header global con logo, idioma y botón de sesión -->
    <div v-if="demoMode" class="demo-notice" role="note">Demo acadèmica · Dades fictícies compartides · Anàlisi precalculada · No és un servei oficial</div>
    <AppHeader />
    
    <!-- Slot donde se renderiza el contenido de cada página -->
    <slot />
  </div>
</template>
