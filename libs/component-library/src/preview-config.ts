import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";
// Import globals from the styles directory
import "./styles/globals.css";

export const previewConfig = {
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "light",
          value: "oklch(1 0 0)", // Your light background color
        },
        {
          name: "dark",
          value: "oklch(0.145 0 0)", // Your dark background color
        },
      ],
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
    },
  },
} satisfies Preview;
