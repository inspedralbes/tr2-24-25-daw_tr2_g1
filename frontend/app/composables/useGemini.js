// composables/useGemini.js
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
      const apiKey = import.meta.env.VITE_GEMINI_KEY;
      if (!apiKey) throw new Error("Falta la API Key");

      const genAI = new GoogleGenerativeAI(apiKey);

      // CAMBIO 1: Usamos un modelo estable y rápido
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2, // Baja temperatura para ser más preciso y menos "creativo"
        },
      });

      // CAMBIO 2: Prompt optimizado para respuestas concisas y separadas
      const prompt = `
        Actúa como un psicopedagogo experto. Analiza el siguiente informe de ${studentName}.
        
        Tu objetivo es extraer datos para un Plan Individualizado (PI).
        Sé EXTREMADAMENTE CONCISO. No uses texto de relleno. Ve al grano.
        
        Devuelve un JSON exacto con estas claves:
        
        {
          "dificultat": "Nombre técnico corto del trastorno o dificultad (Ej: Dislexia, TDAH, Retraso madurativo). Máximo 5 palabras.",
          "gravetat": "Elige SOLO UNO de estos valores: 'Lleu', 'Moderada', 'Greu'. Si no está claro, infiérelo por el contexto.",
          "justificacio": "Resumen telegráfico de la evidencia. Máximo 1 o 2 frases cortas.",
          "proposta_educativa": "Listado de acciones clave separadas por guiones. Solo acciones concretas, sin introducciones.",
          "observacio": ""
        }

        IMPORTANTE: El campo "observacio" debe venir siempre como una cadena vacía "".
        Idioma de respuesta: CATALÁN.

        --- TEXTO DEL INFORME ---
        "${pdfText.substring(0, 30000)}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      aiResponse.value = JSON.parse(text);
    } catch (e) {
      console.error("Gemini Error:", e);
      // Fallback por si falla el parseo o la API
      aiResponse.value = {
        dificultat: "Error analitzant",
        gravetat: "",
        justificacio: "No s'ha pogut extreure informació automàtica.",
        proposta_educativa: "",
        observacio: "",
      };
      error.value = e.message;
    } finally {
      isGenerating.value = false;
    }
  };

  return { aiResponse, isGenerating, error, analyzePdfContent };
};
