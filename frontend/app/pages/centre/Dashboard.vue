<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const currentCentre = ref(null);
const professors = ref([]);
const newEmail = ref('');
const loading = ref(false);
const message = ref({ text: '', type: '' });

onMounted(() => {
  const session = localStorage.getItem('user_centre');
  
  if (!session) {
    router.push('/');
    return;
  }

  currentCentre.value = JSON.parse(session);
  
  // PROTECCIÓN: Si es profesor, redirigir al home (solo centros pueden gestionar docentes)
  if (currentCentre.value?.esProfesor) {
    router.push('/home');
    return;
  }

  fetchProfessors();
});

const fetchProfessors = async () => {
  if (!currentCentre.value?.id) return;

  try {
    const res = await fetch(`http://localhost:3000/api/centre/${currentCentre.value.id}/users`);
    const data = await res.json();
    if (data.success) {
      professors.value = data.data;
    }
  } catch (e) {
    console.error("Error fetch:", e);
  }
};

const addProfessor = async () => {
  if (!newEmail.value) return;
  
  loading.value = true;
  message.value = { text: '', type: '' };

  try {
    const payload = {
      email: newEmail.value.trim().toLowerCase(),
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
      newEmail.value = ''; 
      await fetchProfessors();
    } else {
      message.value = { text: data.error || 'Error al guardar', type: 'error' };
    }
  } catch (e) {
    message.value = { text: 'Error de connexió', type: 'error' };
  } finally {
    loading.value = false;
  }
};

const deleteProfessor = async (id) => {
  if (!confirm("Segur que vols eliminar l'accés a aquest correu?")) return;
  
  try {
    await fetch(`http://localhost:3000/api/admin/users/${id}`, { method: 'DELETE' });
    professors.value = professors.value.filter(p => p.id !== id);
  } catch (e) { console.error(e); }
};

</script>

<template>
  <div class="dashboard-container">
    
    <div class="header-title" v-if="currentCentre">
      <h1>
        Gestió Docents: 
        <span class="centre-name">{{ currentCentre.denominacio_completa || currentCentre.nom }}</span>
      </h1>
    </div>

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
.dashboard-container { 
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #f4f6f9; 
  min-height: calc(100vh - 60px); 
  padding-top: 40px;
  color: #333; 
}

.header-title {
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.header-title h1 {
  font-weight: normal;
  color: #333;
  font-size: 2rem;
  margin: 0;
}

.header-title .centre-name {
  color: #D9001D;
  font-weight: bold;
}

.content { 
  max-width: 900px; 
  margin: 0 auto; 
  padding: 0 20px 40px;
  display: flex; 
  flex-direction: column; 
  gap: 30px; 
}

.card { 
  background: white; 
  padding: 35px; 
  border-radius: 8px; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
}

h3 { 
  margin-top: 0; 
  color: #2c3e50; 
  font-size: 1.3rem; 
  margin-bottom: 15px; 
  font-weight: 600;
}

.desc { 
  color: #666; 
  font-size: 1rem; 
  margin-bottom: 25px; 
  line-height: 1.5;
}

.add-form { display: flex; gap: 15px; }
.add-form input { 
  flex: 1; 
  padding: 14px; 
  border: 1px solid #ccc; 
  border-radius: 4px; 
  font-size: 1rem; 
}
.add-form button { 
  background: #D9001D; 
  color: white; 
  border: none; 
  padding: 0 30px; 
  border-radius: 4px; 
  font-weight: bold; 
  font-size: 1rem;
  cursor: pointer; 
  transition: background 0.2s;
}
.add-form button:hover { background: #b00018; }
.add-form button:disabled { opacity: 0.6; cursor: wait; }

.msg { margin-top: 20px; padding: 15px; border-radius: 4px; font-size: 0.95rem; }
.msg.success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.msg.error { background: #fff5f5; color: #b91c1c; border: 1px solid #fecaca; }

table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th { 
  text-align: left; 
  color: #888; 
  font-size: 0.9rem; 
  font-weight: 600;
  padding: 15px 0; 
  border-bottom: 2px solid #eee; 
}
td { padding: 15px 0; border-bottom: 1px solid #eee; vertical-align: middle; }
.email { font-family: monospace; font-size: 1.05rem; color: #0056b3; }
.btn-delete { 
  background: #fee2e2; 
  color: #b91c1c; 
  border: 1px solid #fecaca; 
  padding: 8px 15px; 
  border-radius: 4px; 
  cursor: pointer; 
  font-size: 0.9rem; 
  transition: all 0.2s;
}
.btn-delete:hover { background: #b91c1c; color: white; border-color: #b91c1c; }
.empty { text-align: center; color: #999; padding: 40px; font-style: italic; font-size: 1.1rem;}
</style>