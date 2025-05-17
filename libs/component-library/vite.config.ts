import { generateViteConfig } from "@j5/config";

export default generateViteConfig({
  name: "component-library",
  dirName: __dirname,
  entry: ["src/index.ts", "src/preview-config.ts"],
  tsconfigTarget: "tsconfig.storybook.json",
})();
