// ============================================
// COMPOSABLE: Gestión de Tabla de Alumnos
// ============================================
// Maneja la carga y visualización de la lista de alumnos
// Define columnas, estado de carga y funciones para obtener datos de la API
import { ref } from 'vue'
// ============================================
// INTERFACES TYPESCRIPT
// ============================================
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

  // ============================================
  // CONFIGURACIÓN DE COLUMNAS
  // ============================================
  // Define qué campos mostrar en la tabla y si son ordenables
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

  // ============================================
  // FUNCIÓN: Cargar alumnos desde API
  // ============================================
  // Detecta si está en SSR o cliente para usar la URL correcta
  const loadStudents = async () => {
    isLoading.value = true
    error.value = null

    try {
      // DETECCIÓN DE ENTORNO: SSR usa 'backend:3000', cliente usa 'localhost:3000'
      const baseURL = import.meta.server ? 'http://backend:3000' : ''
      const response = await $fetch<ApiResponse>(`${baseURL}/api/alumnes`)
      // VALIDACIÓN: Verificar que la respuesta fue exitosa
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

