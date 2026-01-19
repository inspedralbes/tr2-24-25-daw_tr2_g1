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
      Actúa como un psicopedagogo experto especializado en síntesis educativa. He extraído el texto de un informe del alumno ${studentName || "el alumno"}.

      Tu objetivo es filtrar la información irrelevante y generar un resumen EJECUTIVO y PRÁCTICO para su Plan Individualizado (PI). El profesor debe entender el caso en menos de 1 minuto.

      IMPORTANTE: Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta y respetando estas reglas de contenido:

      {
      "dificultat_gravetat": "Sintetiza en MÁXIMO 2 frases la dificultad principal y su impacto en el aprendizaje. Sé directo (ej: 'Dislexia severa que afecta la comprensión lectora y la velocidad de procesamiento').",
  
      "justificacio_pi": "Indica en 1 frase la razón normativa o funcional por la que requiere el PI (ej: 'Desfase curricular de más de un ciclo' o 'Necesidad de adaptación de acceso significativa').",
  
        "proposta_educativa": "Lista de 3 a 5 medidas concretas y aplicables en el aula. NO uses párrafos. Usa un formato de lista con guiones (-). Ejemplo: '- Uso de ordenador para exámenes.\n- Tiempo extra (25%).\n- Adaptación de textos a lectura fácil.'",
  
        "observacions": "" 
      }

      Asegúrate de que el contenido del JSON esté redactado en CATALÁN (o el idioma que use tu centro), con un tono profesional pero directo y sin tecnicismos innecesarios.

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
