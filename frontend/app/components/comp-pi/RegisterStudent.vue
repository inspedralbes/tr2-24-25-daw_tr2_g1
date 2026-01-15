<script setup>
async function searchByRALC() {
  console.log("Buscando por RALC...");
  const response = await $fetch(
    "http://localhost:3000/server/api/create/getStudent"
  );
}
</script>

<template>
  <div>
    <label>RALC</label>
    <input type="text" @keydown.enter="searchByRALC" />
  </div>
</template>
