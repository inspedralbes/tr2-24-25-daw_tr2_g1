import { ref } from 'vue'
interface ApiResponse {
  success: boolean
  data?: Student[]
  error?: string
}

interface Student {
  id?: number
  ralc: string
  nom: string
  cognoms: string
  dni?: string
  dataNaixement?: string
  curs?: string
  centreProcedencia?: string
}
export const useTable = () => {
  const students = ref<Student[]>([])

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
      const response = await $fetch<ApiResponse>(`${baseURL}/api/alumnes`)
      
      if (response.success) {
        students.value = response.data || []
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

