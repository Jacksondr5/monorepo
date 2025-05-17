import { generateViteConfig } from "./generateViteConfig";

describe("generateViteConfig", () => {
  const mockConfig = {
    type: "lib" as const,
    name: "test-lib",
    dirName: "libs/test-lib",
    entry: ["src/index.ts"],
  };

  it("should generate correct build configuration", () => {
    const config = generateViteConfig(mockConfig)();

    expect(config.build).toEqual({
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        entry: mockConfig.entry,
        name: mockConfig.name,
        fileName: "index",
        formats: ["es"],
      },
      outDir: "../../dist/libs/test-lib",
      rollupOptions: {
        external: ["react", "react-dom", "react/jsx-runtime"],
      },
    });
  });

  it("should generate correct cache directory", () => {
    const config = generateViteConfig(mockConfig)();
    expect(config.cacheDir).toBe("../../node_modules/.vite/libs/test-lib");
  });

  it("should set correct root directory", () => {
    const config = generateViteConfig(mockConfig)();
    expect(config.root).toBe(mockConfig.dirName);
  });

  it("should handle app type correctly", () => {
    const appConfig = {
      type: "app" as const,
      name: "test-app",
      dirName: "apps/test-app",
      entry: "src/main.tsx",
    };

    const config = generateViteConfig(appConfig)();
    expect(config.build?.outDir).toBe("../../dist/apps/test-app");
    expect(config.cacheDir).toBe("../../node_modules/.vite/apps/test-app");
  });
});
