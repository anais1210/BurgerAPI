import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "BurgerAPI", // EXACTEMENT le nom du repo GitHub
});
