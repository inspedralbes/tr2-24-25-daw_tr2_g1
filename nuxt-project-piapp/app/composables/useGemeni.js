// useGemini.js
import { ref } from "vue";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const useGemini = () => {
  const aiResponse = ref("");
  const isGenerating = ref(false);
  const error = ref(null);

  // Cambiamos el argumento para recibir el texto del PDF
  const analyzePdfContent = async (pdfText) => {
    isGenerating.value = true;
    error.value = null;
    aiResponse.value = "";

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // --- EL PROMPT ---
      // Instrucciones claras para limpiar y resumir
      const prompt = `
        Actúa como un analista experto y conciso. 
        A continuación te paso el texto crudo extraído de un archivo PDF. 
        El texto puede contener errores de formato, números de página o encabezados desordenados.

        Tu tarea es:
        1. Identificar de qué trata el documento.
        2. Extraer los puntos clave más importantes.
        3. Explicarlo todo en un lenguaje simple, directo y fácil de leer (una "respuesta corriente").
        
        Si el texto es ilegible o muy corto, indícalo.

        --- TEXTO DEL PDF ---
        "${pdfText}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiResponse.value = response.text();
    } catch (e) {
      console.error("Gemini Error:", e);

      if (e.message?.includes("404")) {
        error.value = `Error (404): Modelo no encontrado. Intenta cambiar a 'gemini-1.5-flash'.`;
      } else if (e.message?.includes("400") || e.message?.includes("API key")) {
        error.value = `Error de API Key: Verifica tu archivo .env`;
      } else if (e.message?.includes("429")) {
        error.value = `Error (429): Has superado la cuota de peticiones.`;
      } else if (e.message?.includes("SAFETY")) {
        error.value = `El contenido fue bloqueado por filtros de seguridad.`;
      } else {
        error.value = `Error desconocido: ${e.message}`;
      }
    } finally {
      isGenerating.value = false;
    }
  };

  return { aiResponse, isGenerating, error, analyzePdfContent };
};
