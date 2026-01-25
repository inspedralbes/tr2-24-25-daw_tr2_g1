<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { createStudentPI } from "../../services/apiStudent.js";

// --- PROPS ---
const props = defineProps({
  student: { type: Object, required: true },
  aiData: { type: [Object, String], default: () => ({}) }, // Aceptamos String por si viene JSON crudo
  fileName: { type: String, default: "" },
});

const emit = defineEmits(["back", "save"]);

const router = useRouter();
const isSaving = ref(false);

// ============================================
// ESTADO DEL FORMULARIO
// ============================================
const formData = ref({
  dificultat: "",
  gravetat: "",
  justificacio: "",
  proposta_educativa: "",
  observacio: "",
});

// ============================================
// FUNCIÓN: Rellenar formulario con datos de IA
// ============================================
// Parsea la respuesta de Gemini (puede venir como objeto o string JSON)
const populateForm = () => {
  let data = props.aiData;

  // PASO 1: Parsear JSON si viene como string
  if (typeof data === 'string') {
    try {
      const cleanJson = data.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Error parseando JSON de IA:", e);
      // Si falla, lo metemos todo en justificación
      formData.value.justificacio = props.aiData; 
      return;
    }
  }

  if (data && Object.keys(data).length > 0) {
    // PASO 2: Mapear campos con diferentes variaciones de nombre (minúsculas/mayúsculas)
    formData.value.dificultat = data.dificultat || data.Dificultat || "";
    
    // PASO 3: Normalizar gravedad (capitalizar primera letra)
    // Convierte "greu" -> "Greu", "moderada" -> "Moderada"
    let g = data.gravetat || data.Gravetat || "";
    if (g) {
      // Capitalizar primera letra (ej: "greu" -> "Greu")
      formData.value.gravetat = g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
    } else {
        formData.value.gravetat = "";
    }

    formData.value.justificacio = data.justificacio || data.Justificacio || "";
    formData.value.proposta_educativa = data.proposta_educativa || data.Proposta || "";
    // Respetamos si ya viene observación de la IA, si no, vacío
    formData.value.observacio = data.observacio || data.Observacions || "";
  }
};

// --- REACTIVIDAD ---
watch(() => props.aiData, populateForm, { immediate: true });

// ============================================
// FUNCIÓN: Guardar PI revisado
// ============================================
// Emite los datos editados al componente padre para guardar en BD
function handleSavePI() {
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
    
    <div class="summary-card">
      <div class="summary-header">
        <h2 class="section-title">Revisió de l'Anàlisi IA</h2>
        <span class="badge">Esborrany Automàtic</span>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Alumne:</span>
          <span class="value">{{ student?.name }} {{ student?.surname }}</span>
        </div>
        <div class="info-item">
          <span class="label">RALC:</span>
          <span class="value">{{ student?.ralc }}</span>
        </div>
        <div class="info-item">
          <span class="label">Arxiu Font:</span>
          <span class="value highlight">{{ fileName }}</span>
        </div>
      </div>
    </div>

    <div class="form-container">
      <p class="instruction-text">
        Si us plau, revisa i edita la informació extreta abans de generar el document final.
      </p>

      <div class="form-row-2">
        <div class="form-group">
          <label for="dificultat">Tipus de Dificultat</label>
          <input
            id="dificultat"
            type="text"
            v-model="formData.dificultat"
            placeholder="Ex: Dislèxia"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label for="gravetat">Nivell de Gravetat</label>
          <input 
            id="gravetat" 
            v-model="formData.gravetat" 
            type="text" 
            class="input-field" 
            placeholder="Ex: Moderat"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="justificacio">Justificació</label>
        <textarea
          id="justificacio"
          v-model="formData.justificacio"
          rows="5"
          class="textarea-field"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="proposta">Proposta Educativa / Mesures</label>
        <textarea
          id="proposta"
          v-model="formData.proposta_educativa"
          rows="6"
          class="textarea-field"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="observacio">Observacions (Opcional)</label>
        <textarea
          id="observacio"
          v-model="formData.observacio"
          rows="3"
          class="textarea-field"
          placeholder="Afegeix aquí les teves observacions personals..."
        ></textarea>
      </div>
    </div>

    <div class="buttons-bar">
      <button class="btn-back" @click="$emit('back')">
        ← Tornar enrere
      </button>
      
      <button class="btn-save" @click="handleSavePI" :disabled="isSaving">
        <span v-if="isSaving">Guardant...</span>
        <span v-else>Confirmar i Guardar PI</span>
      </button>
    </div>

  </div>
</template>

<style scoped>
/* FUENTE Y ANIMACIÓN */
.review-container {
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
  animation: fadeIn 0.3s ease-in;
}

/* --- TARJETA RESUMEN --- */
.summary-card {
  background-color: #f8f8f8;
  border-left: 5px solid #d9001d; /* Rojo Gencat */
  padding: 20px 25px;
  border-radius: 4px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.section-title {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 700;
}

.badge {
  background-color: #e6f4ff;
  color: #005c99;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid #b3d9ff;
  text-transform: uppercase;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.info-item .value {
  font-size: 1rem;
  font-weight: 500;
  color: #000;
}

.info-item .value.highlight {
  color: #d9001d;
  font-family: monospace;
}

/* --- FORMULARIO --- */
.form-container {
  background: white;
  padding: 10px 5px; /* Reducido padding interno */
}

.instruction-text {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 25px;
  font-style: italic;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 8px;
}

/* Inputs Gencat */
.input-field,
.textarea-field {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
  transition: all 0.2s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.input-field:focus,
.textarea-field:focus {
  outline: none;
  border-color: #d9001d;
  box-shadow: 0 0 0 3px rgba(217, 0, 29, 0.1);
}

.textarea-field {
  resize: vertical;
  line-height: 1.5;
}

/* --- BOTONES --- */
.buttons-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-back {
  background: none;
  border: 1px solid #ccc;
  color: #555;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-back:hover {
  background-color: #f0f0f0;
  color: #000;
  border-color: #999;
}

.btn-save {
  /* Heredar de .btn-gencat global */
  padding: 12px 32px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .form-row-2 {
    grid-template-columns: 1fr;
  }
  
  .buttons-bar {
    flex-direction: column-reverse;
    gap: 15px;
  }
  
  .btn-back, .btn-save {
    width: 100%;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>