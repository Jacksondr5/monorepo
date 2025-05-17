import { previewConfig } from "../src/preview-config";
import "../src/styles/globals.css"; // Keep component-library specific global styles

// Re-export the shared configuration
export const parameters = previewConfig.parameters;
export const decorators = previewConfig.decorators;
export const globalTypes = previewConfig.globalTypes;
