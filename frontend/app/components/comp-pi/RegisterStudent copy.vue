<script setup>
// 1. Props y Emits
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      nom: "",
      cognom: "",
      ralc: "",
      dni: "",
      data_naixement: "",
      curs: "",
      grup: "",
    }),
  },
});

const emit = defineEmits(["update:modelValue"]);

// Router
const router = useRouter();

// Mensajes de estado
const errorMsg = ref("");
const successMsg = ref("");
const isLoading = ref(false);

// --- HELPER PARA ACTUALIZAR V-MODEL ---
// Esta es la función que te faltaba. Actualiza el objeto sin mutar la prop directamente de forma agresiva.
const updateField = (field, value) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value,
  });
};

// --- FUNCIÓN PARA BUSCAR (GET) ---
async function searchByRALC() {
  const ralcToSearch = props.modelValue.ralc;

  if (!ralcToSearch) {
    errorMsg.value = "Por favor, introduce un RALC para buscar.";
    return;
  }

  isLoading.value = true;
  errorMsg.value = "";
  successMsg.value = "";

  try {
    // Usamos $fetch. Si la API devuelve 404, $fetch lanza error por defecto.
    const response = await $fetch(
      `http://localhost:3000/api/alumnes/${ralcToSearch}`
    );

    if (response) {
      console.log("Alumno encontrado:", response);
      router.push("/student/" + ralcToSearch);
    }
  } catch (err) {
    // Manejo de errores de Nuxt $fetch
    if (err.response && err.response.status === 404) {
      console.log("El alumno no existe (404). Puedes crearlo.");
      // Opcional: successMsg.value = "Alumno nuevo. Puedes rellenar los datos.";
    } else {
      errorMsg.value = "Error al conectar con el servidor.";
      console.error(err);
    }
  } finally {
    isLoading.value = false;
  }
}

// --- FUNCIÓN PARA GUARDAR (POST) ---
async function saveStudent() {
  isLoading.value = true;
  errorMsg.value = "";
  successMsg.value = "";

  // 1. Validar datos básicos
  if (!props.modelValue.ralc || !props.modelValue.nom) {
    errorMsg.value = "El RALC y el Nombre son obligatorios";
    isLoading.value = false;
    return;
  }

  // 2. Preparar Payload (asegurarse de enviar null o string vacío si no hay datos)
  const payload = {
    nom: props.modelValue.nom,
    cognom: props.modelValue.cognom,
    ralc: props.modelValue.ralc,
    dni: props.modelValue.dni,
    data_naixement: props.modelValue.data_naixement,
    curs: props.modelValue.curs, // Agregado al payload
    grup: props.modelValue.grup, // Agregado al payload
  };

  try {
    const response = await $fetch("http://localhost:3000/api/alumnes", {
      method: "POST",
      body: payload,
    });

    // Ajusta esto según cómo responda tu API (si devuelve success:true o el objeto creado)
    if (response) {
      successMsg.value = "Alumne guardat correctament!";
      console.log("Guardado:", response);
    }
  } catch (err) {
    errorMsg.value = err.data?.message || "Error al guardar el alumno.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-white shadow-sm"
  >
    <div
      class="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-between items-center mb-2"
    >
      <h3 class="text-lg font-semibold">DADES ALUMNE</h3>
      <div class="flex flex-col items-end">
        <span v-if="successMsg" class="text-green-600 text-sm font-medium">{{
          successMsg
        }}</span>
        <span v-if="errorMsg" class="text-red-600 text-sm font-medium">{{
          errorMsg
        }}</span>
      </div>
    </div>

    <div class="form-group col-span-1 md:col-span-2">
      <label class="block text-sm font-medium text-gray-700 mb-1">RALC</label>
      <div class="flex gap-2">
        <UInput
          class="flex-1"
          :model-value="modelValue.ralc"
          @update:model-value="(val) => updateField('ralc', val)"
          @keydown.enter="searchByRALC"
          placeholder="Introduce RALC y presiona Enter o Buscar..."
        />
      </div>
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
      <UInput
        :model-value="modelValue.nom"
        @update:model-value="(val) => updateField('nom', val)"
        placeholder="Nom"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700 mb-1"
        >Cognoms</label
      >
      <UInput
        :model-value="modelValue.cognom"
        @update:model-value="(val) => updateField('cognom', val)"
        placeholder="Cognoms"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700 mb-1"
        >DNI / TIE</label
      >
      <UInput
        :model-value="modelValue.dni"
        @update:model-value="(val) => updateField('dni', val)"
        placeholder="DNI"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700 mb-1"
        >Data Naixement</label
      >
      <UInput
        type="date"
        :model-value="modelValue.data_naixement"
        @update:model-value="(val) => updateField('data_naixement', val)"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700 mb-1">Curs</label>
      <UInput
        :model-value="modelValue.curs"
        @update:model-value="(val) => updateField('curs', val)"
        placeholder="Ex: 3r ESO"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700 mb-1">Grup</label>
      <UInput
        :model-value="modelValue.grup"
        @update:model-value="(val) => updateField('grup', val)"
        placeholder="Ex: A"
      />
    </div>

    <div class="col-span-1 md:col-span-2 mt-4 pt-4 border-t flex justify-end">
      <UButton
        color="primary"
        size="lg"
        @click="saveStudent"
        :loading="isLoading"
        icon="i-heroicons-check"
      >
        Guardar Alumno
      </UButton>
    </div>
  </div>
</template>
