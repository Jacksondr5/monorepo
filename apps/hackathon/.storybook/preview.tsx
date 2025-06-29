import "../src/app/global.css";

import React from "react";
import { previewConfigVite } from "@j5/component-library/storybook";
import { MockPostHogProvider } from "../src/lib/posthog.mock";
import { type Preview } from "@storybook/nextjs-vite";
import { TooltipProvider } from "@j5/component-library";

const preview: Preview = {
  ...previewConfigVite,
  decorators: [
    (Story) => (
      <MockPostHogProvider>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </MockPostHogProvider>
    ),
  ],
};

export default preview;
