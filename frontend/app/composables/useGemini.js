// ============================================
// COMPOSABLE: Integración con Gemini AI (Google)
// ============================================
// Analiza PDFs y extrae información estructurada para PIs
// Usa el modelo gemini-2.5-flash con respuesta JSON estructurada
import { ref } from "vue";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const useGemini = () => {
  const aiResponse = ref(null);    // Respuesta parseada de la IA
  const isGenerating = ref(false); // Estado de carga
  const error = ref(null);         // Error si falla la llamada

  // ============================================
  // FUNCIÓN: Analizar contenido de PDF con IA
  // ============================================
  const analyzePdfContent = async (pdfText, studentName) => {
    isGenerating.value = true;
    error.value = null;
    aiResponse.value = null;

    try {
      // PASO 1: Obtener API Key desde la configuración de Nuxt
      const config = useRuntimeConfig();
      const apiKey = config.public.GEMINI_KEY;
      if (!apiKey) throw new Error("Falta la API Key de Gemini");

      const genAI = new GoogleGenerativeAI(apiKey);

      // PASO 2: Configurar modelo para respuesta JSON estructurada
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2, // Baja temperatura = respuestas más precisas y menos creativas
        },
      });

      // PASO 3: Construir prompt con instrucciones estructuradas
      // El prompt define el esquema JSON exacto que debe devolver la IA
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

      // PASO 4: Enviar texto del PDF a Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // PASO 5: Parsear respuesta JSON
      aiResponse.value = JSON.parse(text);
    } catch (e) {
      console.error("Gemini Error:", e);
      // FALLBACK: Si falla la IA, devolver estructura vacía para que el usuario complete manualmente
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
