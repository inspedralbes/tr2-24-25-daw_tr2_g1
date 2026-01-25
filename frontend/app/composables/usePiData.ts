// ============================================
// COMPOSABLE: Estado Global de PI (Versión Antigua)
// ============================================
// NOTA: Este composable está obsoleto, se usa usePiState.js en su lugar
// Se mantiene por compatibilidad con código antiguo
export const usePiData = () => {
    // Estado global del PI con useState de Nuxt
    const piData = useState('pi-data', () => ({
        studentName: '',
        ralc: '',
        dni: '',
        birthDate: '',
        grade: '',
        group: '',
        // Campos estructurados del análisis
        dificultat_gravetat: '',
        justificacio_pi: '',
        proposta_educativa: '',
        observacions: '',

        id: null as number | null
    }))

    // FUNCIÓN: Actualizar datos del PI
    const setPiData = (data: any) => {
        piData.value = { ...piData.value, ...data }
    }

    // FUNCIÓN: Limpiar todos los datos
    const clearPiData = () => {
        piData.value = {
            studentName: '',
            ralc: '',
            dni: '',
            birthDate: '',
            grade: '',
            group: '',
            dificultat_gravetat: '',
            justificacio_pi: '',
            proposta_educativa: '',
            observacions: '',
            id: null
        }
    }

    return {
        piData,
        setPiData,
        clearPiData
    }
}
