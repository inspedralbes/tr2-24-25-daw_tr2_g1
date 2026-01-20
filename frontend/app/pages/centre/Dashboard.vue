<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- ESTADO ---
const currentCentre = ref(null);
const professors = ref([]);
const newEmail = ref('');
const loading = ref(false);
const message = ref({ text: '', type: '' });

// --- CARGA INICIAL ---
onMounted(() => {
  // 1. Verificar si hay sesión iniciada
/*  const session = localStorage.getItem('user_centre'); // Asegúrate que tu Login guarda esto
  
  if (!session) {
    router.push('/'); // Si no hay login, volver al inicio
    return;
 }*/ 

  // 2. Recuperar datos del centro (ID, nombre, etc.)
  currentCentre.value = JSON.parse(session);
  
  // 3. Cargar la lista de profesores de ESTE centro
  fetchProfessors();
});

const fetchProfessors = async () => {
  if (!currentCentre.value?.id) return;

  try {
    // Petición al backend filtrando por ID
    const res = await fetch(`http://localhost:3000/api/centre/${currentCentre.value.id}/users`);
    const data = await res.json();
    if (data.success) {
      professors.value = data.data;
    }
  } catch (e) {
    console.error("Error fetch:", e);
  }
};

// --- AÑADIR PROFESOR ---
const addProfessor = async () => {
  if (!newEmail.value) return;
  
  loading.value = true;
  message.value = { text: '', type: '' };

  try {
    const payload = {
      email: newEmail.value.trim().toLowerCase(),
      // ¡IMPORTANTE! Enviamos el ID del centro logueado automáticamente
      centre_id: currentCentre.value.id 
    };

    const res = await fetch('http://localhost:3000/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      message.value = { text: 'Professor autoritzat correctament!', type: 'success' };
      newEmail.value = ''; // Limpiar campo
      await fetchProfessors(); // Recargar tabla
    } else {
      message.value = { text: data.error || 'Error al guardar', type: 'error' };
    }
  } catch (e) {
    message.value = { text: 'Error de connexió', type: 'error' };
  } finally {
    loading.value = false;
  }
};

// --- BORRAR PROFESOR ---
const deleteProfessor = async (id) => {
  if (!confirm("Segur que vols eliminar l'accés a aquest correu?")) return;
  
  try {
    await fetch(`http://localhost:3000/api/admin/users/${id}`, { method: 'DELETE' });
    // Actualizar vista
    professors.value = professors.value.filter(p => p.id !== id);
  } catch (e) { console.error(e); }
};

const logout = () => {
  localStorage.removeItem('user_centre');
  router.push('/');
};
</script>

<template>
  <div class="dashboard-container">
    
    <nav class="navbar" v-if="currentCentre">
      <div class="brand">
        <h2>Gestió Docents: <span>{{ currentCentre.denominacio_completa || currentCentre.nom }}</span></h2>
      </div>
      <button @click="logout" class="btn-logout">Sortir</button>
    </nav>

    <main class="content">
      
      <section class="card add-section">
        <h3>Autoritzar nou correu</h3>
        <p class="desc">Introdueix el correu (XTEC/Gmail) del docent per donar-li accés als PIs d'aquest centre.</p>
        
        <form @submit.prevent="addProfessor" class="add-form">
          <input 
            v-model="newEmail" 
            type="email" 
            placeholder="Ex: m.garcia@xtec.cat" 
            required
          />
          <button type="submit" :disabled="loading">
            {{ loading ? 'Guardant...' : '+ Autoritzar' }}
          </button>
        </form>

        <p v-if="message.text" :class="['msg', message.type]">
          {{ message.text }}
        </p>
      </section>

      <section class="card list-section">
        <h3>Docents amb accés</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Correu Electrònic</th>
                <th style="text-align: right;">Accions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prof in professors" :key="prof.id">
                <td class="email">{{ prof.email }}</td>
                <td style="text-align: right;">
                  <button @click="deleteProfessor(prof.id)" class="btn-delete">Eliminar</button>
                </td>
              </tr>
              <tr v-if="professors.length === 0">
                <td colspan="2" class="empty">Cap docent autoritzat encara.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
/* ESTILOS */
.dashboard-container { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; min-height: 100vh; color: #333; }

.navbar {
  background: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-bottom: 1px solid #e1e4e8;
}
.brand h2 { margin: 0; font-size: 1.1rem; color: #555; }
.brand span { color: #D9001D; font-weight: bold; margin-left: 5px; }
.btn-logout { background: white; border: 1px solid #ccc; padding: 6px 15px; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
.btn-logout:hover { background: #f0f0f0; color: #D9001D; border-color: #D9001D; }

.content { max-width: 800px; margin: 40px auto; padding: 0 20px; display: flex; flex-direction: column; gap: 30px; }

.card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #eef0f2; }
h3 { margin-top: 0; color: #2c3e50; font-size: 1.2rem; margin-bottom: 10px; }
.desc { color: #666; font-size: 0.9rem; margin-bottom: 20px; }

/* Formulario */
.add-form { display: flex; gap: 10px; }
.add-form input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
.add-form button { background: #D9001D; color: white; border: none; padding: 0 25px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.add-form button:hover { background: #b00018; }
.add-form button:disabled { opacity: 0.6; cursor: wait; }

/* Mensajes */
.msg { margin-top: 15px; padding: 12px; border-radius: 6px; font-size: 0.9rem; }
.msg.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.msg.error { background: #fff5f5; color: #b91c1c; border: 1px solid #fecaca; }

/* Tabla */
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th { text-align: left; color: #888; font-size: 0.85rem; text-transform: uppercase; padding: 10px 0; border-bottom: 2px solid #f0f0f0; }
td { padding: 15px 0; border-bottom: 1px solid #f0f0f0; }
.email { font-family: monospace; font-size: 1rem; color: #0369a1; }
.btn-delete { background: #fee2e2; color: #b91c1c; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
.btn-delete:hover { background: #fecaca; }
.empty { text-align: center; color: #999; padding: 30px; font-style: italic; }
</style>