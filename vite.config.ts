import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  server: {
    port: 53000,
    https: {
      cert: process.env.VITE_SSL_CRT_FILE ? fs.readFileSync(process.env.VITE_SSL_CRT_FILE) : undefined,
      key: process.env.VITE_SSL_KEY_FILE ? fs.readFileSync(process.env.VITE_SSL_KEY_FILE) : undefined,
    },
  },
});
