<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

// --- PROPS ---
// Recibimos los datos del padre (crear-pi)
const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
  aiData: {
    type: Object,
    default: () => ({}),
  },
  fileName: {
    type: String,
    default: "",
  },
});

const router = useRouter();
const isSaving = ref(false);

// --- FORM STATE ---
// Mapeamos lo que devuelve la IA a nuestro formulario
const formData = ref({
  dificultat: "",
  gravetat: "",
  justificacio: "",
  proposta_educativa: "",
  observacio: "",
});

// Al montar, rellenamos con lo que dijo la IA
onMounted(() => {
  if (props.aiData) {
    // Ajusta las claves según lo que devuelva exactamente tu useGemini
    // Aquí asumo que la IA devuelve claves similares o texto plano
    formData.value.dificultat =
      props.aiData.dificultat || props.aiData.difficulty || "";
    formData.value.gravetat =
      props.aiData.gravetat || props.aiData.severity || "";
    formData.value.justificacio =
      props.aiData.justificacio || props.aiData.justification || "";
    formData.value.proposta_educativa =
      props.aiData.proposta_educativa || props.aiData.proposal || "";
    formData.value.observacio =
      props.aiData.observacio || props.aiData.observations || "";
  }
});

// --- API CALL ---
async function handleSavePI() {
  if (!props.student || !props.student.ralc) {
    alert("Error: No se ha identificado al alumno.");
    return;
  }

  isSaving.value = true;

  // Preparamos el payload para el Backend
  const payload = {
    ralc: props.student.ralc,
    professor_id: 1, // TODO: Coger esto del usuario logueado (pinia/localStorage)
    ruta_pdf: props.fileName || "documento_analizado.pdf",
    ...formData.value,
  };

  try {
    // Hacemos la petición (ajusta la URL a tu configuración)
    const response = await fetch(
      "http://localhost:3000/api/alumne/plan_individualitzat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();

    if (result.success || response.ok) {
      alert("Plan Individualizado guardado con éxito!");
      // Redirigir a la ficha del alumno o limpiar
      router.push(`/student/${props.student.ralc}`);
    } else {
      throw new Error(result.error || "Error desconocido al guardar");
    }
  } catch (e) {
    console.error(e);
    alert("Error al guardar el PI: " + e.message);
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="review-container">
    <div class="header-review">
      <h2>📝 Revisió i Guardat</h2>
      <p class="subtitle">
        Revisa les dades extretes per la IA per a l'alumne:
        <strong>{{ student?.name }} {{ student?.surname }}</strong>
      </p>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Dificultat detectada</label>
        <textarea
          v-model="formData.dificultat"
          rows="2"
          placeholder="Ex: Dislèxia, TDAH..."
        ></textarea>
      </div>

      <div class="form-group">
        <label>Gravetat</label>
        <select v-model="formData.gravetat" class="form-select">
          <option value="">Selecciona...</option>
          <option value="Lleun">Lleu</option>
          <option value="Moderada">Moderada</option>
          <option value="Greu">Greu</option>
        </select>
      </div>

      <div class="form-group full-width">
        <label>Justificació (Resum de l'informe)</label>
        <textarea
          v-model="formData.justificacio"
          rows="4"
          placeholder="Explicació del motiu del PI..."
        ></textarea>
      </div>

      <div class="form-group full-width">
        <label>Proposta Educativa</label>
        <textarea
          v-model="formData.proposta_educativa"
          rows="4"
          placeholder="Accions a realitzar..."
        ></textarea>
      </div>

      <div class="form-group full-width">
        <label>Observacions Addicionals</label>
        <textarea v-model="formData.observacio" rows="2"></textarea>
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
.review-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-review {
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 0.95em;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.full-width {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  font-size: 0.9em;
  color: #333;
}

textarea,
.form-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s;
}

textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #d00000;
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
  padding: 10px 25px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.btn-save:disabled {
  background-color: #ffcccc;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: transparent;
  color: #666;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #f5f5f5;
}
</style>
