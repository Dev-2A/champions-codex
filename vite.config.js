import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages: https://dev-2a.github.io/champions-codex/
  base: "/champions-codex/",
  plugins: [react(), tailwindcss()],
});
