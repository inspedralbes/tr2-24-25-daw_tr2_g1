<script setup lang="ts">
import { ref } from "vue";

// 1. Definir la interfaz para los datos (TypeScript)
interface StudentData {
  nom: string;
  cognom: string;
  ralc: string;
  dni: string;
  data_naixement: string;
  curs: string; // Not in DB, but in UI
  grup: string; // Not in DB, but in UI
}

// Props y Emits para v-model
const props = defineProps<{
  modelValue: StudentData;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: StudentData): void;
}>();

const errorMsg = ref("");
const successMsg = ref("");
const isLoading = ref(false);

// Función auxiliar para actualizar campos individuales
const updateField = (field: keyof StudentData, value: string) => {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
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
    const response: any = await $fetch(
      `http://localhost:3000/api/alumne/${ralcToSearch}`,
      {
        ignoreResponseError: true,
      }
    );

    if (response && response.data) {
      // Alumno existe
      console.log("Alumno encontrado:", response.data);

      useRouter().push("/student/" + ralcToSearch);
    }
  } catch (err: any) {
    // 404 falls here with $fetch usually if not handled, but we used ignoreResponseError?
    // Actually $fetch with ignoreResponseError might not throw for 404?
    // Nuxt 3 $fetch behavior: if error, throws.
    // If we catch 404, valid.
    if (err.statusCode === 404) {
      console.log("El alumno no existe (404). Puedes crearlo.");
      // Clean fields but keep RALC
      // successMsg.value = "Alumne no trobat. Pots crear-lo nou.";
    } else {
      errorMsg.value = "Error al buscar l'alumne.";
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

  // 1. Validar datos básicos antes de enviar
  if (!props.modelValue.ralc || !props.modelValue.nom) {
    errorMsg.value = "El RALC y el Nombre son obligatorios";
    isLoading.value = false;
    return;
  }

  const payload = {
    nom: props.modelValue.nom,
    cognom: props.modelValue.cognom,
    ralc: props.modelValue.ralc,
    dni: props.modelValue.dni,
    data_naixement: props.modelValue.data_naixement, // <--- Cuidado aquí
  };

  console.log("ENVIANDO PAYLOAD:", payload); // <--- MIRA ESTO EN LA CONSOLA DEL NAVEGADOR

  try {
    const response: any = await $fetch("http://localhost:3000/api/alumnes", {
      method: "POST",
      body: payload,
    });

    if (response.success) {
      successMsg.value = "Alumne guardat correctament!";
      console.log("Respuesta guardado:", response);
    } else {
      errorMsg.value = response.error || "Error desconegut al guardar.";
    }
  } catch (err: any) {
    errorMsg.value = err.data?.error || "Error crític al guardar.";
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
      class="col-span-1 md:col-span-2 flex justify-between items-center mb-2"
    >
      <h3 class="text-lg font-semibold">DADES ALUMNE</h3>
      <span v-if="successMsg" class="text-green-600 text-sm font-medium">{{
        successMsg
      }}</span>
      <span v-if="errorMsg" class="text-red-600 text-sm font-medium">{{
        errorMsg
      }}</span>
    </div>

    <div class="form-group col-span-1 md:col-span-2">
      <label class="block text-sm font-medium text-gray-700">RALC</label>
      <div class="flex gap-2">
        <UInput
          class="flex-1"
          :model-value="modelValue.ralc"
          @update:model-value="(val) => updateField('ralc', val)"
          placeholder="Introduce RALC y busca..."
        />
        <UButton
          color="neutral"
          variant="solid"
          @click="searchByRALC"
          :loading="isLoading"
        >
          Buscar
        </UButton>
      </div>
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700">Nom</label>
      <UInput
        :model-value="modelValue.nom"
        @update:model-value="(val) => updateField('nom', val)"
        placeholder="Nom"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700">Cognoms</label>
      <UInput
        :model-value="modelValue.cognom"
        @update:model-value="(val) => updateField('cognom', val)"
        placeholder="Cognoms"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700">DNI / TIE</label>
      <UInput
        :model-value="modelValue.dni"
        @update:model-value="(val) => updateField('dni', val)"
        placeholder="DNI"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700"
        >Data Naixement</label
      >
      <UInput
        type="date"
        :model-value="modelValue.data_naixement"
        @update:model-value="(val) => updateField('data_naixement', val)"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700">Curs</label>
      <UInput
        :model-value="modelValue.curs"
        @update:model-value="(val) => updateField('curs', val)"
        placeholder="Ex: 3r ESO"
      />
    </div>

    <div class="form-group">
      <label class="block text-sm font-medium text-gray-700">Grup</label>
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
      >
        Guardar Alumno
      </UButton>
    </div>
  </div>
</template>
