import { ref } from "vue";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const useGemini = () => {
  const aiResponse = ref(null);
  const isGenerating = ref(false);
  const error = ref(null);

  const analyzePdfContent = async (pdfText, studentName) => {
    isGenerating.value = true;
    error.value = null;
    aiResponse.value = null;

    try {
      // 1. OBTENCIÓN DE LA CLAVE (Dentro de la función para mayor seguridad)
      // Si usas Vite puro: import.meta.env.VITE_GEMINI_KEY
      // Si usas Nuxt y no te funciona, prueba: useRuntimeConfig().public.GEMINI_KEY
      const apiKey = import.meta.env.VITE_GEMINI_KEY;

      if (!apiKey) {
        throw new Error(
          "Falta la API Key (VITE_GEMINI_KEY) en el archivo .env",
        );
      }

      // 2. INICIALIZACIÓN
      const genAI = new GoogleGenerativeAI(apiKey);

      // 3. MODELO CORRECTO: Usamos 'gemini-1.5-flash' (2.5 no existe aún)
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = `
        Actúa como un psicopedagogo experto. He extraído el texto de un informe escolar/psicológico del alumno ${studentName || "desconocido"}.
        
        Tu tarea es analizar el texto y generar un resumen estructurado para un Plan Individualizado (PI) en formato JSON.
        
        IMPORTANTE: Debes devolver UNICAMENTE un objeto JSON válido con la siguiente estructura exacta:
        {
          "dificultat_gravetat": "Resumen breve de la dificultad y gravedad detectada",
          "justificacio_pi": "Justificación de por qué necesita un plan individualizado",
          "proposta_educativa": "Propuesta educativa y medidas sugeridas",
          "observacions": "" 
        }

        Nota: El campo "observacions" debe estar vacío (cadena vacía).

        --- TEXTO DEL PDF ---
        "${pdfText.substring(0, 30000)}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // 4. PARSEO SEGURO
      try {
        aiResponse.value = JSON.parse(text);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        // Si la IA falla en dar JSON, guardamos el texto plano en 'justificacio_pi' para no perderlo
        aiResponse.value = {
          dificultat_gravetat: "Format incorrecte de la IA",
          justificacio_pi: text, // Guardamos lo que haya dicho la IA
          proposta_educativa: "Revisar manualment",
          observacions: "",
        };
      }
    } catch (e) {
      console.error("Gemini Error Detallado:", e);
      // Mensaje de error más descriptivo para ti
      if (e.message.includes("404") || e.message.includes("not found")) {
        error.value =
          "Error: El modelo de IA no existe o la ruta es incorrecta.";
      } else if (e.message.includes("API key")) {
        error.value = "Error: API Key inválida o no encontrada.";
      } else {
        error.value = "Error al conectar con la IA: " + e.message;
      }
    } finally {
      isGenerating.value = false;
    }
  };

  return { aiResponse, isGenerating, error, analyzePdfContent };
};
