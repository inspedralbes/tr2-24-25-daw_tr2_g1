<script setup lang="ts">
const searchQuery = ref('')

// Usar el composable useTable
const { students, columns, isLoading, error, loadStudents } = useTable()

// Cargar datos al montar el componente
onMounted(() => {
  loadStudents()
})

// --- Lógica de Filtrado ---
// Filtramos automáticamente según lo que escribas en el buscador
const filteredStudents = computed(() => {
  if (!searchQuery.value) return toRaw(students.value)
  
  const q = searchQuery.value.toLowerCase()
  return toRaw(students.value).filter((s: any) => 
    s.name.toLowerCase().includes(q) || 
    s.id.includes(q)
  )
})
</script>

<template>
  <div>
    
    <div>
      <div>
        <h1>Buscar Alumno</h1>
        <p>Consulta los Planes Individualizados (PI) existentes.</p>
      </div>
    </div>

    <div>
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Buscar por nombre, NIA o expediente..." 
      />
    </div>

    <!-- Tabla de alumnos -->
    <div v-if="filteredStudents.length > 0" class="table-container">
      <table class="students-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            <th>Accions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id">
            <td>{{ student.id }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.course }}</td>
            <td>{{ student.instituto }}</td>
            <td>{{ student.status }}</td>
            <td>
              <NuxtLink :to="`/student/${student.id}`" class="btn-view">
                Veure detall
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sin resultados -->
    <div v-else>
      <p>No se encontraron alumnos con ese criterio.</p>
      <NuxtLink to="/pi/new">
        Crear nuevo PI
      </NuxtLink>
    </div>

  </div>
</template>

<style scoped>
.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.students-table th,
.students-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.students-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.students-table tbody tr:hover {
  background-color: #f3f4f6;
  cursor: pointer;
}

.students-table td {
  color: #1f2937;
  font-size: 14px;
}

.students-table tbody tr:last-child td {
  border-bottom: none;
}

.btn-view {
  display: inline-block;
  padding: 6px 12px;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-view:hover {
  background-color: #2563eb;
}
</style>