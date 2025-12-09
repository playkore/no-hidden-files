import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      includeAssets: ["apple-touch-icon.png"],
      minify: false,
      workbox: {
        // Skip the terser step because the sandbox rejects rollup worker exits.
        mode: "development",
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        id: "/no-hidden-files/",
        name: "There Are No Hidden Files",
        short_name: "No Hidden Files",
        description:
          "A retro filesystem puzzle dressed up as Norton Commander Mobile.",
        theme_color: "#122c0e",
        background_color: "#0a1a07",
        display: "standalone",
        scope: "/no-hidden-files/",
        start_url: "/no-hidden-files/",
        lang: "en",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
  base: "/no-hidden-files/",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
