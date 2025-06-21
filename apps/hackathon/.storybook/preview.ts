import { previewConfigVite } from "@j5/component-library/storybook";
import type { Preview } from "@storybook/nextjs";

const preview: Preview = {
  ...previewConfigVite,
} satisfies Preview;

export default preview;
