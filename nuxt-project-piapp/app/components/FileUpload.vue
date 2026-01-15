<script setup lang="ts">
const value = ref(null);
</script>

<template>
  <h3>Subir Fichero</h3>
  <UFileUpload :dropzone="true" label="Drop your PDF here." v-model="value" />
</template>
