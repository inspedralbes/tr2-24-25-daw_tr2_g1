<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const route = useRoute()
const studentId = route.params.id

// Estado de carga
const isLoading = ref(false)
const error = ref(null)
const student = ref(null)
const pdfs = ref([])

// DATOS DE EJEMPLO - Reemplazar con llamada a BD
const datosEjemplo = {
  '101': {
    ralc: '101',
    nom: 'Ana',
    cognoms: 'García López',
    dni: '12345678A',
    dataNaixement: '2005-03-15',
    curs: '3r ESO',
    grup: 'A',
    tutor: 'Sr. Pérez',
    email: 'ana.garcia@example.com',
    telefono: '612345678',
    estado: 'Completo',
    listadoPI: [
      { 
        id: 1, 
        titulo: 'Temps extra en exàmens', 
        descripcion: '30 minuts addicionals en totes les avaluacions',
        fechaCreacion: '2024-09-01',
        activo: true
      },
      { 
        id: 2, 
        titulo: 'Material adaptat', 
        descripcion: 'Apunts en format digital i presentacions accessibles',
        fechaCreacion: '2024-09-01',
        activo: true
      }
    ],
    observaciones: 'Alumna amb excel·lent actitud i participació a classe. Necessita seguiment personalitzat en matèries tècniques.'
  },
  '102': {
    ralc: '102',
    nom: 'Carlos',
    cognoms: 'Ruíz Martínez',
    dni: '23456789B',
    dataNaixement: '2006-07-22',
    curs: '4t ESO',
    grup: 'B',
    tutor: 'Sra. Martínez',
    email: 'carlos.ruiz@example.com',
    telefono: '623456789',
    estado: 'Pendiente',
    listadoPI: [
      { 
        id: 1, 
        titulo: 'Suport en programació', 
        descripcion: 'Sessions addicionals de reforç en desenvolupament web',
        fechaCreacion: '2024-10-15',
        activo: true
      }
    ],
    observaciones: 'Alumne molt motivat però necessita més pràctica en els conceptes de backend.'
  },
  '103': {
    ralc: '103',
    nom: 'Lucía',
    cognoms: 'Méndez Sánchez',
    dni: '34567890C',
    dataNaixement: '2005-11-08',
    curs: '3r ESO',
    grup: 'A',
    tutor: 'Sr. López',
    email: 'lucia.mendez@example.com',
    telefono: '634567890',
    estado: 'En Revisión',
    listadoPI: [
      { 
        id: 1, 
        titulo: 'Adaptació per mobilitat reduïda', 
        descripcion: 'Accés prioritari a aules i laboratoris adaptats',
        fechaCreacion: '2024-09-01',
        activo: true
      },
      { 
        id: 2, 
        titulo: 'Material digital', 
        descripcion: 'Tots els materials disponibles en format digital',
        fechaCreacion: '2024-09-01',
        activo: true
      }
    ],
    observaciones: 'Alumna amb gran capacitat d\'organització i treball autònom. Excel·lent rendiment acadèmic.'
  }
}

// PDFs de ejemplo por estudiante
const pdfsEjemplo = {
  '101': [
    {
      id: 1,
      nombre: 'PI_Ana_Garcia_2024.pdf',
      fechaSubida: '2024-09-01',
      tipo: 'Plan Individualizado',
      url: '/pdfs/ana_pi.pdf',
      resumen: 'Aquest document conté el pla individualitzat per a l\'alumna amb adaptacions específiques per a les avaluacions i materials didàctics.'
    },
    {
      id: 2,
      nombre: 'Informe_Seguiment_Q1.pdf',
      fechaSubida: '2024-11-15',
      tipo: 'Seguimiento',
      url: '/pdfs/ana_seguiment.pdf',
      resumen: 'Informe de seguiment del primer trimestre amb avaluació del compliment dels objectius establerts al PI.'
    }
  ],
  '102': [
    {
      id: 1,
      nombre: 'PI_Carlos_Ruiz_2024.pdf',
      fechaSubida: '2024-10-15',
      tipo: 'Plan Individualizado',
      url: '/pdfs/carlos_pi.pdf',
      resumen: 'Pla individualitzat centrat en el suport addicional per a programació i desenvolupament web.'
    }
  ],
  '103': [
    {
      id: 1,
      nombre: 'PI_Lucia_Mendez_2024.pdf',
      fechaSubida: '2024-09-01',
      tipo: 'Plan Individualizado',
      url: '/pdfs/lucia_pi.pdf',
      resumen: 'Pla d\'adaptacions per mobilitat reduïda i accés a materials digitals.'
    },
    {
      id: 2,
      nombre: 'Avaluacio_Trimestral.pdf',
      fechaSubida: '2024-12-10',
      tipo: 'Evaluación',
      url: '/pdfs/lucia_avaluacio.pdf',
      resumen: 'Avaluació trimestral amb notes excel·lents i observacions positives sobre l\'evolució de l\'alumna.'
    },
    {
      id: 3,
      nombre: 'Seguiment_Mensual_Nov.pdf',
      fechaSubida: '2024-11-30',
      tipo: 'Seguimiento',
      url: '/pdfs/lucia_seguiment_nov.pdf',
      resumen: 'Seguiment mensual del novembre amb observacions sobre l\'adaptació a les noves metodologies.'
    }
  ]
}

// Función para descargar PDF
const descargarPdf = (pdf) => {
  // TODO: Implementar descarga real
  window.open(pdf.url, '_blank')
}

// Timeline items para PDFs
const timelineItems = computed<TimelineItem[]>(() => {
  if (!pdfs.value || pdfs.value.length === 0) return []
  
  return pdfs.value.map(pdf => ({
    date: pdf.fechaSubida,
    title: pdf.nombre,
    description: pdf.tipo,
    icon: 'i-lucide-file-text',
    to: pdf.url
  }))
})

// Cargar datos del estudiante
const cargarDatos = async () => {
  isLoading.value = true
  error.value = null

  try {
    // SIMULACIÓN DE CONSULTA A BD
    await new Promise((resolve) => setTimeout(resolve, 500))

    // TODO: Reemplazar con consulta real a BD
    // Ejemplo con Supabase:
    // const { data: studentData } = await supabase
    //   .from('students')
    //   .select('*, listadoPI(*)')
    //   .eq('id', studentId)
    //   .single()
    // student.value = studentData
    //
    // const { data: pdfsData } = await supabase
    //   .from('pdfs')
    //   .select('*')
    //   .eq('studentId', studentId)
    //   .order('fechaSubida', { ascending: false })
    // pdfs.value = pdfsData

    // Obtener datos según el ID del estudiante
    const studentData = datosEjemplo[studentId as string]
    const studentPdfs = pdfsEjemplo[studentId as string] || []
    
    if (!studentData) {
      throw new Error('Estudiant no trobat')
    }

    student.value = studentData
    pdfs.value = studentPdfs
  } catch (err) {
    error.value = 'Error al cargar los datos del estudiante'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Cargar datos al montar
onMounted(() => {
  cargarDatos()
})
</script>

<template>
  <div class="student-detail">
    <!-- Navegación -->
    <div class="nav-back">
      <NuxtLink to="/search" class="btn-back">
        ← Tornar a la cerca
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <p>Carregant dades...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-box">
      <p>{{ error }}</p>
      <button @click="cargarDatos" class="btn-retry">Reintentar</button>
    </div>

    <!-- Datos del estudiante -->
    <div v-else-if="student" class="content">
      
      <!-- Cabecera -->
      <div class="header">
        <div>
          <h1>{{ student.nom }} {{ student.cognoms }}</h1>
          <p class="subtitle">RALC: {{ student.ralc }} | {{ student.curs }} {{ student.grup }}</p>
        </div>
      </div>

      <!-- Información General -->
      <section class="info-section">
        <h2>Informació General</h2>
        <div class="info-grid">
          <div class="info-item">
            <strong>DNI / TIE:</strong> {{ student.dni }}
          </div>
          <div class="info-item">
            <strong>Data de Naixement:</strong> {{ student.dataNaixement }}
          </div>
          <div class="info-item">
            <strong>Curs:</strong> {{ student.curs }}
          </div>
          <div class="info-item">
            <strong>Grup:</strong> {{ student.grup }}
          </div>
          <div class="info-item">
            <strong>Tutor/a:</strong> {{ student.tutor }}
          </div>
          <div class="info-item">
            <strong>Email:</strong> {{ student.email }}
          </div>
          <div class="info-item">
            <strong>Telèfon:</strong> {{ student.telefono }}
          </div>
        </div>
      </section>

      <!-- Plans Individualitzats -->
      <section class="info-section">
        <h2>Plans Individualitzats ({{ student.listadoPI?.length || 0 }})</h2>
        <div v-if="student.listadoPI && student.listadoPI.length > 0" class="pi-list">
          <div v-for="pi in student.listadoPI" :key="pi.id" class="pi-card">
            <h3>{{ pi.titulo }}</h3>
            <p>{{ pi.descripcion }}</p>
            <div class="pi-meta">
              <span>Creat el: {{ pi.fechaCreacion }}</span>
              <span :class="['badge', pi.activo ? 'active' : 'inactive']">
                {{ pi.activo ? 'Actiu' : 'Inactiu' }}
              </span>
            </div>
          </div>
        </div>
        <p v-else class="empty-message">No hi ha plans individualitzats assignats.</p>
      </section>

      <!-- Observaciones -->
      <section v-if="student.observaciones" class="info-section">
        <h2>Observacions</h2>
        <p class="observations">{{ student.observaciones }}</p>
      </section>

      <!-- PDFs / Documentos -->
      <section class="info-section">
        <h2>Documents i PDFs ({{ pdfs?.length || 0 }})</h2>
        <div v-if="pdfs && pdfs.length > 0">
          <div class="pdf-list">
            <div v-for="pdf in pdfs" :key="pdf.id" class="pdf-card">
              <div class="pdf-header">
                <div>
                  <h3>{{ pdf.nombre }}</h3>
                  <p class="pdf-meta">{{ pdf.tipo }} • {{ pdf.fechaSubida }}</p>
                </div>
                <button @click="descargarPdf(pdf)" class="btn-download">
                  Descarregar
                </button>
              </div>
              <div v-if="pdf.resumen" class="pdf-summary">
                <strong>Resum:</strong>
                <p>{{ pdf.resumen }}</p>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="empty-message">No hi ha documents disponibles.</p>
      </section>

    </div>

  </div>
</template>

<style scoped>
.student-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.nav-back {
  margin-bottom: 20px;
}

.btn-back {
  display: inline-block;
  padding: 8px 16px;
  background-color: #f3f4f6;
  color: #374151;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-back:hover {
  background-color: #e5e7eb;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.error-box {
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  padding: 20px;
  border-radius: 8px;
  color: #991b1b;
}

.btn-retry {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
}

.info-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
}

.info-item strong {
  color: #1f2937;
  display: block;
  margin-bottom: 4px;
}

.pi-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pi-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
}

.pi-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.pi-card p {
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 14px;
}

.pi-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #9ca3af;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.badge.active {
  background-color: #d1fae5;
  color: #065f46;
}

.badge.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.observations {
  color: #374151;
  line-height: 1.6;
  font-size: 14px;
  margin: 0;
}

.pdf-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pdf-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.pdf-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.pdf-meta {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #6b7280;
}

.btn-download {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-download:hover {
  background-color: #2563eb;
}

.pdf-summary {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.pdf-summary strong {
  color: #1f2937;
  font-size: 14px;
}

.pdf-summary p {
  margin: 8px 0 0 0;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
}

.empty-message {
  color: #6b7280;
  font-style: italic;
  margin: 0;
}
</style>