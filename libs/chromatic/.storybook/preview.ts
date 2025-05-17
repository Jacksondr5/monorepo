import type { Preview } from "@storybook/react";
import previewConfig from "@j5/component-library";
import "../src/globals.css"; // Keep chromatic specific global styles if any

const preview: Preview = {
  parameters: {
    ...previewConfig.parameters,
    docs: {
      theme: "light",
    },
  },
};

export default preview;
