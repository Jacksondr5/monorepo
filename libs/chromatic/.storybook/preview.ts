import "../src/globals.css";

import type { Preview } from "@storybook/react-vite";

import { j5Theme } from "@j5/component-library/storybook";

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
