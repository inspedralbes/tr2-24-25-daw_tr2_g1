import { ref } from 'vue'

export const useTable = () => {
  // Datos de ejemplo - TODO: Reemplazar con consulta real a BD
  // Ejemplo con Supabase:
  // const { data: students } = await supabase.from('students').select('*')
  
  const students = ref([
    { 
      id: '101', 
      name: 'Ana García', 
      course: '2º DAM', 
      instituto: 'INS Pedralbes', 
      status: 'Completo', 
      lastUpdate: '12/10/2023' 
    },
    { 
      id: '102', 
      name: 'Carlos Ruíz', 
      course: '1º DAW', 
      instituto: 'IES Barcelona', 
      status: 'Pendiente', 
      lastUpdate: '01/11/2023' 
    },
    { 
      id: '103', 
      name: 'Lucía Méndez', 
      course: '2º DAM', 
      instituto: 'INS Pedralbes', 
      status: 'En Revisión', 
      lastUpdate: 'Hoy' 
    },
  ])

  // Columnas de la tabla
  const columns = [
    { 
      key: 'id', 
      label: 'NIA',
      sortable: true,
      id: 'id'
    },
    { 
      key: 'name', 
      label: 'Nom',
      sortable: true,
      id: 'name'
    },
    { 
      key: 'course', 
      label: 'Curs',
      id: 'course'
    },
    { 
      key: 'instituto', 
      label: 'Institut',
      id: 'instituto'
    },
    { 
      key: 'status', 
      label: 'Estat PI',
      id: 'status'
    }
  ]

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Función para cargar datos de la BD (placeholder)
  const loadStudents = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Implementar llamada real a BD
      // const { data, error: dbError } = await supabase
      //   .from('students')
      //   .select('*')
      //   .order('name', { ascending: true })
      // 
      // if (dbError) throw dbError
      // students.value = data
      
      // Simulación de delay
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (err: any) {
      error.value = err.message
      console.error('Error loading students:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    students,
    columns,
    isLoading,
    error,
    loadStudents
  }
}

