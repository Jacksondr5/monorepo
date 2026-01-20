import type { Preview as PreviewVite } from "@storybook/react-vite";
import { j5Theme } from "./j5-sb-theme";
import { MockPostHogProvider } from "./providers/posthog.mock";
import { TooltipProvider } from "../components/tooltip/tooltip";

export const previewConfigVite: PreviewVite = {
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
