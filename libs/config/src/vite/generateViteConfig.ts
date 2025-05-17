import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export const generateViteConfig =
  ({
    name,
    dirName,
    entry,
    tsconfigTarget,
  }: {
    name: string;
    dirName: string;
    entry: string[] | string;
    tsconfigTarget: string;
  }) =>
  () => {
    return defineConfig({
      build: {
        commonjsOptions: {
          transformMixedEsModules: true,
        },
        emptyOutDir: true,
        lib: {
          entry,
          name,
          fileName: "index",
          formats: ["es"],
        },
        rollupOptions: {
          // External packages that should not be bundled into your library.
          external: ["react", "react-dom", "react/jsx-runtime"],
        },
      },
      plugins: [
        tailwindcss(),
        react(),
        tsconfigPaths(),
        nxViteTsPaths(),
        dts({
          entryRoot: "src",
          tsconfigPath: path.join(dirName, tsconfigTarget),
        }),
      ],
      root: dirName,
    });
  };
