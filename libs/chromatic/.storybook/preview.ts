import { previewConfig } from "@j5/component-library";
import "../src/globals.css"; // Keep chromatic specific global styles if any

// Re-export the shared configuration
export const parameters = previewConfig.parameters;
export const decorators = previewConfig.decorators;
export const globalTypes = previewConfig.globalTypes;
