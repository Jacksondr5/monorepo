import "../src/app/global.css";

import React from "react";
import { previewConfigVite } from "@j5/component-library/storybook";
import { MockPostHogProvider } from "../src/lib/posthog.mock";
import { type Preview } from "@storybook/nextjs-vite";
import { TooltipProvider } from "@j5/component-library";
import { ClerkProvider } from "@clerk/nextjs";

const preview: Preview = {
  ...previewConfigVite,
  decorators: [
    (Story) => (
      <MockPostHogProvider>
        <TooltipProvider>
          <ClerkProvider>
            <Story />
          </ClerkProvider>
        </TooltipProvider>
      </MockPostHogProvider>
    ),
  ],
};

export default preview;
