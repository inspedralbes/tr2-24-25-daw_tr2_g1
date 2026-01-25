// ============================================
// COMPOSABLE: Estado Global del Plan Individualizado (PI)
// ============================================
// Gestiona el estado compartido durante la creación de un PI
// Mantiene datos del alumno y análisis generado por IA en un solo lugar
// Utiliza useState de Nuxt para persistir durante la navegación

export const usePiState = () => {
  return useState("pi_data", () => ({
    // Paso actual del proceso de creación del PI
    step: 1,
    
    // Datos personales del alumno
    student: {
      name: "",       // Nombre del alumno
      surname: "",    // Apellidos del alumno
      ralc: "",       // Código RALC único del alumno
      dni: "",        // DNI del alumno
      date: "",       // Fecha de nacimiento
      course: "",     // Curso actual
      group: "",      // Grupo/clase
    },
    
    // Análisis del PI - generado por IA o introducido manualmente
    analysis: {
      dificultat_gravetat: "",    // Dificultades y gravedad
      justificacio_pi: "",         // Justificación del PI
      proposta_educativa: "",      // Propuesta educativa adaptada
      observacions: "",            // Observaciones adicionales
    },
  }));
};
