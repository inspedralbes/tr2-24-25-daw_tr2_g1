<script setup lang="ts">
const value = ref(null);
</script>

<template>
  <h3>Informes Previs</h3>
  <UFileUpload :dropzone="true" label="Texto aqui" v-model="value" />
</template>
