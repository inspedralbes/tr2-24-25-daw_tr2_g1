<!-- ============================================
  COMPONENTE RAÍZ DE LA APLICACIÓN
  ============================================
  Punto de entrada principal de Nuxt
  Define estilos globales y estructura básica
-->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* ============================================
   ESTILOS GLOBALES
   ============================================
   Reset CSS y configuración base para toda la app */

/* Reset de márgenes y padding */
body, html {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* Evita scroll horizontal */
  font-family: 'Open Sans', Arial, sans-serif; /* Fuente global aplicada a toda la app */
}

/* Box-sizing para todos los elementos */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Contenedores principales de Nuxt */
#__nuxt, #__layout {
  width: 100%;
  min-height: 100vh;
}
</style>