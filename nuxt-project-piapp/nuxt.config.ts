// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Add this section to disable Server-Side Rendering (SSR) for the pdf reader page
  routeRules: {
    // Assuming your file is named 'pdfreader.vue' inside the 'pages' folder
    "/pdfreader": { ssr: false },
  },

  // Optional: If you run into build issues later with pdfjs-dist,
  // you might need to explicitly transpile it, but try without this first.
  build: {
    transpile: ["pdfjs-dist"],
  },
});
