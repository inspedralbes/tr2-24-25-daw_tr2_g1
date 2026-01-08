// composables/useGemini.js
import { ref } from "vue";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const useGemini = () => {
  const aiResponse = ref("");
  const isGenerating = ref(false);
  const error = ref(null);

  const analyzePdfContent = async (pdfText, studentName) => {
    isGenerating.value = true;
    error.value = null;
    aiResponse.value = "";

    try {
      // Usamos flash para rapidez, o pro para mayor razonamiento
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Actúa como un psicopedagogo experto. He extraído el texto de un informe escolar/psicológico del alumno ${
          studentName || "desconocido"
        }.
        
        Tu tarea es analizar el texto y generar un resumen estructurado para un Plan Individualizado (PI).
        Ignora encabezados, pies de página o texto basura.

        Estructura la respuesta obligatoriamente en estas secciones:
        1. **Diagnóstico/Necesidades Detectadas**: (Resumen breve de la situación).
        2. **Puntos Fuertes**: (Qué se le da bien al alumno).
        3. **Barreras/Dificultades**: (Qué le cuesta).
        4. **Propuestas de Medidas**: (Sugerencias prácticas para el aula basadas en el texto).

        --- TEXTO DEL PDF ---
        "${pdfText.substring(0, 30000)}" // Limitamos caracteres por seguridad
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiResponse.value = response.text();
    } catch (e) {
      console.error("Gemini Error:", e);
      error.value = "Error al conectar con la IA.";
    } finally {
      isGenerating.value = false;
    }
  };

  return { aiResponse, isGenerating, error, analyzePdfContent };
};
