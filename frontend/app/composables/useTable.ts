import { ref } from 'vue'

export const useTable = () => {
  const students = ref([])

  // Columnas de la tabla
  const columns = [
    {
      key: 'ralc',
      label: 'RALC',
      sortable: true,
      id: 'ralc'
    },
    {
      key: 'nom',
      label: 'Nom',
      sortable: true,
      id: 'nom'
    },
    {
      key: 'cognoms',
      label: 'Cognoms',
      sortable: true,
      id: 'cognoms'
    },
    {
      key: 'curs',
      label: 'Curs',
      id: 'curs'
    }
  ]

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Función para cargar datos de la BD
  const loadStudents = async () => {
    isLoading.value = true
    error.value = null

    try {
      const baseURL = import.meta.server ? 'http://backend:3000' : 'http://localhost:3000'
      const response = await $fetch(`${baseURL}/api/alumnes`)

      if (response.success) {
        students.value = response.data
      } else {
        throw new Error(response.error || 'Error carregant alumnes')
      }
    } catch (err: any) {
      error.value = err.message || 'Error de connexió amb el servidor'
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

