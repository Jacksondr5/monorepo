import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths(), react(), nxViteTsPaths()],
});
