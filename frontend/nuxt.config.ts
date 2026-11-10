// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: process.env.NUXT_PUBLIC_DEMO_MODE !== 'true',
  compatibilityDate: "2024-11-01", // Actualizado a fecha estable

  // 1. CARGA GLOBAL DEL SCRIPT DE GOOGLE Y CSS GLOBAL
  app: {
    head: {
      meta: process.env.NUXT_PUBLIC_DEMO_MODE === 'true' ? [{ name: 'robots', content: 'noindex, nofollow' }] : [],
      script: process.env.NUXT_PUBLIC_DEMO_MODE === 'true' ? [] : [
        {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true
        }
      ]
    }
  },

  // 2. IMPORTAR CSS GLOBAL
  css: ['~/assets/css/global.css'],

  components: {
    dirs: ["~/components", "~/components/comp-pi"],
  },
  
  devtools: { enabled: process.env.NUXT_PUBLIC_DEMO_MODE !== 'true' },
  
  devServer: {
    // Esto permite que Docker lo exponga bien
    host: "0.0.0.0", 
    port: 5173, 
  },

  modules: ["@nuxt/ui"],

  runtimeConfig: {
    apiOrigin: process.env.API_ORIGIN || 'http://backend:3000',
    public: {
      demoMode: process.env.NUXT_PUBLIC_DEMO_MODE === 'true',
      GEMINI_KEY: process.env.GEMINI_KEY || "",
    },
  },

  routeRules: {
    '/api/**': { proxy: (process.env.API_ORIGIN || 'http://127.0.0.1:8059') + '/api/**' },
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