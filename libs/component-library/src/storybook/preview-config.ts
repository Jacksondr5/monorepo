import type { Preview as PreviewVite } from "@storybook/react-vite";
import { j5Theme } from "./j5-sb-theme";
import "../styles/globals.css";

export const previewConfigVite = {
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
} satisfies PreviewVite;
