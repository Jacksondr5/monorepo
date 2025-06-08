import { create } from "storybook/theming/create";
import { ThemeVars } from "storybook/theming";

export const j5Theme: ThemeVars = create({
  appBg: "#111210", // Radix Olive Dark 1
  appBorderColor: "#363b42", // Radix Slate Dark 6
  appBorderRadius: 6, // from --radius-md (6px)
  appContentBg: "#161714", // Radix Olive Dark 2
  appPreviewBg: "#111210", // Radix Olive Dark 1 (same as appBg for consistency)
  barBg: "#1c1e1a", // Radix Olive Dark 3
  barHoverColor: "#53d266", // Radix Grass Dark 10
  barSelectedColor: "#46a758", // Radix Grass Dark 9
  barTextColor: "#c8cdd3", // Radix Slate Dark 11
  base: "dark",
  brandImage: "https://storybook.js.org/images/placeholders/350x150.png", // TODO: Add J5 logo
  brandTarget: "_self",
  brandTitle: "J5 Component Library",
  brandUrl: "https://jackson.codes",
  colorPrimary: "#46a758", // Radix Grass Dark 9
  colorSecondary: "#0090ff", // Radix Blue Dark 9
  fontBase:
    "'Geist Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  fontCode:
    "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  inputBg: "#25282c", // Radix Slate Dark 3
  inputBorder: "#3e444c", // Radix Slate Dark 7
  inputBorderRadius: 4, // from --radius-sm (4px)
  inputTextColor: "#ededef", // Radix Slate Dark 12
  textColor: "#ededef", // Radix Slate Dark 12
  textInverseColor: "#151718", // Radix Slate Dark 1 (for text on colored/light backgrounds)
});
