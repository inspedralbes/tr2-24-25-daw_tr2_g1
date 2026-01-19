<script setup>
import { getByRalcStudent, createStudent } from "../../services/apiStudent.js";

const inputRalc = ref("");
const blockedInput = ref(true);
const dniError = ref(false);

// Datos del formulario
const formData = ref({
  name: "",
  surname: "",
  dni: "",
  date: "",
  course: "",
  group: "",
});

// Función para comprobar si el estudiante existe.
async function fetchStudentByRalc() {
  console.log("Buscando RALC:", inputRalc.value);

  if (!inputRalc.value) return;

  const data = await getByRalcStudent(inputRalc.value);

  const existStudent = data && data.length > 0;

  if (existStudent) {
    // CASO A: SI EXISTE -> Navegar

    await navigateTo(`/student/${inputRalc.value}`);
  } else {
    // CASO B: NO EXISTE -> Desbloquear el formulario

    blockedInput.value = false;
  }
}

// Función para guardar el nuevo estudiante.
async function saveNewStudent() {
  // Validación básica
  if (!formData.value.name || !inputRalc.value) {
    alert("Faltan datos obligatorios (RALC y Nombre)");
    return;
  }

  // Preparamos el paquete de datos uniendo el RALC con el resto
  const paqueteAEnviar = {
    ralc: inputRalc.value, // El RALC viene del input de arriba
    ...formData.value, // El resto viene del formulario
  };

  console.log("Enviando:", paqueteAEnviar);

  const respuesta = await createStudent(paqueteAEnviar);

  if (respuesta && respuesta.success) {
    alert("¡Alumno creado correctamente!");
    // Opcional: Redirigir a la ficha del alumno recién creado
    await navigateTo(`/student/${inputRalc.value}`);
  }
}

// Función para validar el DNI

function isValidDNIFormat(dni) {
  if (!dni) return false;

  const regex = /^\d{8}[A-Za-z]$/;
  

  return regex.test(dni);
}
function checkDni() {
  if (formData.value.dni && !isValidDNIFormat(formData.value.dni)) {
    dniError.value = true;
  } else {
    dniError.value = false;
  }
}
function handleDniInput() {
  dniError.value = false;
  if(formData.value.dni) {
      formData.value.dni = formData.value.dni.toUpperCase();
  }
}
</script>

<template>
  <div class="form">
    <h3>Dades alumne</h3>

    <div class="child-form">
      <label>RALC: </label>
      <input
        v-model="inputRalc"
        type="text"
        placeholder="Introduce RALC + Enter"
        @keypress.enter="fetchStudentByRalc"
        :disabled="!blockedInput"
      />
    </div>

    <hr />

    <div :class="{ 'form-disabled': blockedInput }">
      <h3>Crear Nuevo Estudiante</h3>

      <div class="child-form">
        <label for="student-name">Nombre: </label>
        <input
          v-model="formData.name"
          type="text"
          placeholder="Nombre del alumno"
          :disabled="blockedInput"
        />
      </div class="child-form">

      <div class="child-form">
        <label for="student-surname">Apellidos: </label>
        <input
          v-model="formData.surname"
          type="text"
          placeholder="Apellidos"
          :disabled="blockedInput"
        />
      </div>

      <div class="child-form">
        <label for="student-dni">DNI: </label>
        <input
          id="student-dni"
          v-model.trim="formData.dni"
          type="text"
          maxlength="9"
          placeholder="12345678A"
          :disabled="blockedInput"
          :class="{ 'input-error': dniError }"
          @input="handleDniInput"
          @blur="checkDni"
        />
        <span v-if="dniError" class="error-msg">
          DNI incorrecto (Letra o formato inválido)
        </span>
      </div>

      <div class="child-form">
        <label for="student-date">Data Naixement</label>
        <input v-model="formData.date" type="date" :disabled="blockedInput" />
      </div>

    <div class="child-form">
      <label for="student-course">Curs</label>
      <select 
        id="student-course" 
        v-model="formData.course" 
        :disabled="blockedInput"
        class="form-select"
      >
        <option disabled value="">Selecciona un curs</option>
        
        <option value="1r d'ESO">1r d'ESO</option>
        <option value="2n d'ESO">2n d'ESO</option>
        <option value="3r d'ESO">3r d'ESO</option>
        <option value="4t d'ESO">4t d'ESO</option>
        <option value="1r Batxillerat">1r Batxillerat</option>
        <option value="2n Batxillerat">2n Batxillerat</option>
      </select>
    </div>

      <div class="child-form">
        <label for="student-group">Grup</label>
        <input v-model="formData.grup" type="text" :disabled="blockedInput" />
      </div>

      <div style="margin-top: 20px">
        <button @click="saveNewStudent" :disabled="blockedInput">
          Guardar Alumno
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

  .child-form {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
}

 /* dni style  */
  .input-error {
  border: 1px solid red;
  background-color: #ffe6e6;
}

.error-msg {
  color: red;
  font-size: 0.8em;
  display: block;
  margin-top: 4px;
}

/* estilo para el formulario deshabilitado */
.form-disabled {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}
</style>
