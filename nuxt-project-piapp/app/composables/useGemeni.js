// composables/useGemini.js
import { ref } from "vue";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const useGemini = () => {
  const aiResponse = ref(null);
  const isGenerating = ref(false);
  const error = ref(null);

  const analyzePdfContent = async (pdfText, studentName) => {
    isGenerating.value = true;
    error.value = null;
    aiResponse.value = null; // Changed from "" to null/object

    try {
      // Usamos flash para rapidez, o pro para mayor razonamiento
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

      const prompt = `
        Actúa como un psicopedagogo experto. He extraído el texto de un informe escolar/psicológico del alumno ${studentName || "desconocido"
        }.
        
        Tu tarea es analizar el texto y generar un resumen estructurado para un Plan Individualizado (PI) en formato JSON.
        
        IMPORTANTE: Debes devolver UNICAMENTE un objeto JSON válido con la siguiente estructura exacta:
        {
          "dificultat_gravetat": "Resumen breve de la dificultad y gravedad detectada",
          "justificacio_pi": "Justificación de por qué necesita un plan individualizado",
          "proposta_educativa": "Propuesta educativa y medidas sugeridas",
          "observacions": "" 
        }

        Nota: El campo "observacions" debe estar vacío (cadena vacía), ya que lo rellenará el profesor manualmente.

        --- TEXTO DEL PDF ---
        "${pdfText.substring(0, 30000)}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        aiResponse.value = JSON.parse(text);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        // Fallback for non-JSON response (though we requested JSON)
        aiResponse.value = {
          dificultat_gravetat: "Error parseando respuesta",
          justificacio_pi: text,
          proposta_educativa: "",
          observacions: ""
        };
      }

    } catch (e) {
      console.error("Gemini Error:", e);
      error.value = "Error al conectar con la IA.";
    } finally {
      isGenerating.value = false;
    }
  };

  return { aiResponse, isGenerating, error, analyzePdfContent };
};
