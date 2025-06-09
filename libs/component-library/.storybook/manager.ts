import { addons } from "storybook/manager-api";
import { j5Theme } from "../src/storybook/j5-sb-theme";

addons.setConfig({
  theme: j5Theme,
});
