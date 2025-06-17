import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174, // তুমি যে port চাও এখানে দাও
    host: true, // চাইলে LAN access করার জন্য এটা true রাখো
  },
});
