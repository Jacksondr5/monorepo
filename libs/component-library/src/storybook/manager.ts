import { addons } from "storybook/manager-api";
import { j5Theme } from "./j5-sb-theme";

export const configureManager = () => {
  addons.setConfig({
    theme: j5Theme,
  });
};
