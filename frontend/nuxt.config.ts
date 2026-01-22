// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01", // Actualizado a fecha estable

  // 1. CARGA GLOBAL DEL SCRIPT DE GOOGLE
  app: {
    head: {
      script: [
        {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true
        }
      ]
    }
  },

  components: {
    dirs: ["~/components", "~/components/comp-pi"],
  },
  
  devtools: { enabled: true },
  
  devServer: {
    // Esto permite que Docker lo exponga bien
    host: "0.0.0.0", 
    port: 5173, 
  },

  modules: ["@nuxt/ui"],

  css: ['~/assets/css/shared-styles.css'],

  runtimeConfig: {
    public: {
      GEMINI_KEY: process.env.GEMINI_KEY || "",
    },
  },

  routeRules: {
    "/pdfreader": { ssr: false },
  },

  vite: {
    optimizeDeps: {
      include: ["pdfjs-dist"],
      esbuildOptions: {
        target: "esnext",
      },
    },
    build: {
      target: "esnext",
    },
  },

  build: {
    transpile: ["pdfjs-dist", "jspdf"],
  },
});