<!-- ============================================
  LAYOUT POR DEFECTO
  ============================================
  Layout principal de la aplicación
  Incluye el header en todas las páginas y un slot para el contenido
-->
<template>
  <div>
    <!-- Header global con logo, idioma y botón de sesión -->
    <AppHeader />
    
    <!-- Slot donde se renderiza el contenido de cada página -->
    <slot />
  </div>
</template>
