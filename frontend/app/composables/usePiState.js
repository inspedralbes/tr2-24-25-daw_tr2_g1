// composables/usePiState.js
export const usePiState = () => {
  return useState("pi_data", () => ({
    step: 1,
    student: {
      name: "",
      surname: "",
      ralc: "",
      dni: "",
      date: "",
      course: "",
      group: "",
    },
    // Aquí guardaremos lo que devuelva la IA o lo que escriba el usuario
    analysis: {
      dificultat_gravetat: "",
      justificacio_pi: "",
      proposta_educativa: "",
      observacions: "",
    },
  }));
};
