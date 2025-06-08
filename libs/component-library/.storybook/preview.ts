// import { previewConfig } from "../src/preview-config";
import "../src/styles/globals.css"; // Keep component-library specific global styles

// // Re-export the shared configuration
// // export const parameters = previewConfig.parameters;
// // export const decorators = previewConfig.decorators;
// // export const globalTypes = previewConfig.globalTypes;

// export default previewConfig;

import type { Preview } from "@storybook/react-vite";

import j5Theme from "./j5-theme";

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        j5: { name: "J5", value: "#111210" },
      },
    },
    docs: {
      theme: j5Theme,
    },
  },
  initialGlobals: {
    backgrounds: { value: "j5" },
  },
};

export default preview;
