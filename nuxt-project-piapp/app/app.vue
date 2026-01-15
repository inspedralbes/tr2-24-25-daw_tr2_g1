<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>

body, html {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* Evita que aparezca barra de scroll horizontal si algo se pasa un píxel */
  font-family: 'Open Sans', Arial, sans-serif; /* Fuente por defecto */
}

*, *::before, *::after {
  box-sizing: border-box;
}

#__nuxt, #__layout {
  width: 100%;
  min-height: 100vh;
}
</style>