import "../src/app/global.css";

import React from "react";
import { previewConfigVite } from "@j5/component-library/storybook";
import { MockPostHogProvider } from "../src/lib/posthog.mock";
import { type Preview } from "@storybook/nextjs-vite";

const preview: Preview = {
  ...previewConfigVite,
  decorators: [
    (Story) => (
      <MockPostHogProvider>
        <Story />
      </MockPostHogProvider>
    ),
  ],
};

export default preview;
