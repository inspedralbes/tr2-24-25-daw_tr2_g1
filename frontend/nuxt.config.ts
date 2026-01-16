// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  components: {
    dirs: ["~/components", "~/components/comp-pi"],
  },
  devtools: { enabled: true },
  devServer: {
    host: process.env.URL_FRONTEND || "http://localhost",
    port: Number(process.env.PORT_FRONTEND) || 5173,
  },

  modules: ["@nuxt/ui"],

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
