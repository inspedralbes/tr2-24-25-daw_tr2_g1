export const usePiData = () => {
    const piData = useState('pi-data', () => ({
        studentName: '',
        ralc: '',
        dni: '',
        birthDate: '',
        grade: '',
        group: '',
        // New structured fields
        dificultat_gravetat: '',
        justificacio_pi: '',
        proposta_educativa: '',
        observacions: '',

        id: null as number | null
    }))

    const setPiData = (data: any) => {
        piData.value = { ...piData.value, ...data }
    }

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
