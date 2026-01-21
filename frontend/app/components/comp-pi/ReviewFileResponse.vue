<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { createStudentPI } from "../../services/apiStudent.js";

// NOTA NUXT:
// Si tu archivo está en la carpeta 'utils/apiStudent.js', NO necesitas importar nada.
// Si prefieres mantenerlo en 'services/', descomenta la siguiente línea:
// import { createStudentPI } from "~/services/apiStudent.js";

// --- PROPS ---
const props = defineProps({
  student: { type: Object, required: true },
  aiData: { type: Object, default: () => ({}) },
  fileName: { type: String, default: "" },
});

const emit = defineEmits(["back", "save"]);

const router = useRouter();
const isSaving = ref(false);

// --- FORM STATE ---
const formData = ref({
  dificultat: "",
  gravetat: "",
  justificacio: "",
  proposta_educativa: "",
  observacio: "",
});

// --- FUNCIÓN PARA RELLENAR DATOS ---
const populateForm = () => {
  if (props.aiData && Object.keys(props.aiData).length > 0) {
    formData.value.dificultat = props.aiData.dificultat || "";

    // Normalizar gravedad
    let g = props.aiData.gravetat || "";
    if (g) {
      formData.value.gravetat =
        g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
    }

    formData.value.justificacio = props.aiData.justificacio || "";
    formData.value.proposta_educativa = props.aiData.proposta_educativa || "";
  }
};

// --- REACTIVIDAD ---
watch(() => props.aiData, populateForm, { immediate: true });

// --- GUARDADO REAL (CORREGIDO) ---
// --- REEMPLAZADO POR EMIT para que el padre gestione la subida de archivo ---
function handleSavePI() {
  // Emitimos los datos limpios al padre (crear-pi.vue)
  // El padre llamará a fileUpload.uploadPdfAndSaveData con estos datos
  const dataToSave = {
    dificultat: formData.value.dificultat,
    gravetat: formData.value.gravetat,
    justificacio: formData.value.justificacio,
    proposta_educativa: formData.value.proposta_educativa,
    observacio: formData.value.observacio,
  };
  
  emit("save", dataToSave);
}
</script>

<template>
  <div class="review-container">
    <div class="header-review">
      <h2>📝 Revisió i Guardat</h2>
      <p class="subtitle">
        Revisa les dades extretes per la IA per a l'alumne:
        <strong>{{ student?.nom }} {{ student?.cognom }}</strong>
      </p>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Dificultat detectada</label>
        <input
          type="text"
          v-model="formData.dificultat"
          placeholder="Ex: Dislèxia"
          class="input-clean"
        />
      </div>

      <div class="form-group">
        <label>Gravetat</label>
        <select v-model="formData.gravetat" class="form-select">
          <option value="">Selecciona...</option>
          <option value="Lleu">Lleu</option>
          <option value="Moderada">Moderada</option>
          <option value="Greu">Greu</option>
        </select>
      </div>

      <div class="form-group full-width">
        <label>Justificació (Essència)</label>
        <textarea
          v-model="formData.justificacio"
          rows="3"
          placeholder="Motiu principal..."
        ></textarea>
      </div>

      <div class="form-group full-width">
        <label>Proposta Educativa (Accions Clau)</label>
        <textarea
          v-model="formData.proposta_educativa"
          rows="5"
          placeholder="Llista d'accions..."
        ></textarea>
      </div>

      <div class="form-group full-width highlight-manual">
        <label>Observacions (A rellenar manualment)</label>
        <textarea
          v-model="formData.observacio"
          rows="2"
          placeholder="Afegeix aquí les teves observacions personals..."
        ></textarea>
      </div>
    </div>

    <div class="actions">
      <button class="btn-cancel" @click="$emit('back')">Enrere</button>
      <button class="btn-save" @click="handleSavePI" :disabled="isSaving">
        <span v-if="isSaving">Guardant...</span>
        <span v-else>✅ Confirmar i Guardar PI</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Tus estilos (Sin cambios) */
.review-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-top: 20px;
}
.full-width {
  grid-column: span 2;
}
label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
input,
textarea,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 0.95rem;
  transition: all 0.2s;
  background-color: #fafafa;
}
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #d00000;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(208, 0, 0, 0.1);
}
.highlight-manual textarea {
  border-color: #ccc;
  background-color: #fff;
}
.actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}
.btn-save {
  background-color: #d00000;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-save:hover {
  background-color: #b00000;
}
.btn-cancel {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}
</style>
