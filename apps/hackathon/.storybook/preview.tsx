import "../src/app/global.css";

import React from "react";
import { previewConfigVite } from "@j5/component-library/storybook";
import { MockPostHogProvider } from "../src/lib/posthog.mock";

export default {
  ...previewConfigVite,
  decorators: [
    (Story) => (
      <MockPostHogProvider>
        <Story />
      </MockPostHogProvider>
    ),
  ],
};
