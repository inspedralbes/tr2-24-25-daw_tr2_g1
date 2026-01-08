// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // ADD THIS SECTION:
  modules: ["@nuxt/ui"],

  routeRules: {
    "/pdfreader": { ssr: false },
  },

  build: {
    transpile: ["pdfjs-dist"],
  },
});
