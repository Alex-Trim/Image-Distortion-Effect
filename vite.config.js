import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Image-Distortion-Effect/", // Замените <repo-name> на имя вашего репозитория на GitHub
});
