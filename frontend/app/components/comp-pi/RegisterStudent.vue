<script setup>
import { getByRalcStudent, createStudent } from "../../services/apiStudent.js";

const router = useRouter();

const inputRalc = ref("");
const blockedInput = ref(true);
const dniError = ref(false);
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
  console.log("--- INICIO BÚSQUEDA ---");
  // ... logs ...

  if (!inputRalc.value) return;

  try {
    const response = await getByRalcStudent(inputRalc.value);
    console.log("2. Datos recibidos:", response); 

    let existStudent = false;

    if (Array.isArray(response)) {
        existStudent = response.length > 0;
    } 
    else if (response && response.success === true && response.data) {
        existStudent = Object.keys(response.data).length > 0;
    }
    else if (response && (response.ralc || response.id)) {
        existStudent = true;
    }

    if (existStudent) {      
      await navigateTo(`/student/${inputRalc.value}`); 
    } else {
      blockedInput.value = false;
    }
  } catch (e) {
    console.error("ERROR EN BÚSQUEDA:", e);
    blockedInput.value = false;
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

// Función para enviar datos al padre.
async function submitStudentForm() {
  // 1. Basic validation
  if (!inputRalc.value) {
    alert("Has d'introduir un RALC vàlid.");
    return { success: false };
  }

  // 2. Creation Logic (Only if form is unblocked)
  if (!blockedInput.value) {
    if (!formData.value.name) {
      alert("El nom és obligatori.");
      return { success: false };
    }

    if (dniError.value) {
      alert("El DNI no és vàlid.");
      return { success: false };
    }

    // OBTENER EL CENTRE_ID DEL USUARIO LOGUEADO (profesor o centro)
    let centreId = null;
    const userCentre = localStorage.getItem('user_centre');
    if (userCentre) {
      const centreData = JSON.parse(userCentre);
      centreId = centreData.id; // El ID del centro (tanto si es profesor como si es centro)
    }

    const paqueteAEnviar = {
      ralc: inputRalc.value,
      ...formData.value,
      centre_procedencia_id: centreId, // AGREGAMOS EL CENTRO
    };

    try {
      const respuesta = await createStudent(paqueteAEnviar);
      
      if (respuesta && (respuesta.success || respuesta.id)) {
        return { success: true, data: paqueteAEnviar };
      } else {
        return { success: false };
      }
    } catch (e) {
      console.error(e);
      return { success: false, error: e.message }; 
    }
  }
  
  return { success: false, message: "Form is blocked" };
}

defineExpose({
  submitStudentForm
});
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
        @keypress.enter.prevent="fetchStudentByRalc"
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
        <input v-model="formData.group" type="text" :disabled="blockedInput" />
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
