<script setup>
import { getByRalcStudent } from "~/services/apiStudent";

const inputRalc = ref("");
const blockedInput = ref(true); // Inicialmente ocultamos el formulario de registro

async function fetchStudentByRalc() {
  console.log("Buscando RALC:", inputRalc.value);
  const data = await getByRalcStudent(inputRalc.value);

  const existStudent = data && data.length > 0; // Comprobar si el array tiene elementos o si es null

  if (existStudent) {
    // CASO A: SI EXISTE.
    await navigateTo(`/student/${inputRalc.value}`);
  } else {
    // CASO B: NO EXISTE.
    blockedInput.value = false; // Esto hará que el div v-if="!blockedInput" aparezca
  }
}
</script>

<template>
  <div>
    <h3>Dades alumne</h3>

    <div>
      <label>RALC: </label>
      <input
        v-model="inputRalc"
        type="text"
        placeholder="Introduce RALC + Enter"
        @keypress.enter="fetchStudentByRalc"
        :blocked="!blockedInput"
      />
    </div>

    <div v-if="!blockedInput">
      <h3>Crear Nuevo Estudiante</h3>
      <p>
        El RALC <strong>{{ inputRalc }}</strong> no existe. Rellena los datos:
      </p>

      <div>
        <input type="text" placeholder="Nombre" />
      </div>
    </div>
  </div>
</template>
