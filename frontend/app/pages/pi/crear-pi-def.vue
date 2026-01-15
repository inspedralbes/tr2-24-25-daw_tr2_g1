<script setup>
// Definir datos del estudiante del formulario.
const StudentData = ref({
  nom: "",
  cognom: "",
  ralc: "",
  dni: "",
  data_naixement: "",
  curs: "", // Not in DB, Falta integrar a la base de datos
  grup: "", // Not in DB, Falta integrar a la base de datos
});
</script>

<template>
  <div>
    <RegisterStudent v-model="StudentData" />
    <!-- <FileUpload /> -->
  </div>
</template>
