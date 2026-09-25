import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Freebuff requires HMR to remain disabled, the dev server to bind on 0.0.0.0,
// and the injected PORT to be honoured inside isolated workspaces.
const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port,
    strictPort: false,
    hmr: false,
  },
  preview: {
    host: "0.0.0.0",
    port,
  },
});
