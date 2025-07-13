import React, { type ReactNode } from "react";
import { EditingProvider } from "~/contexts/EditingContext";
import { TaskProvider } from "~/contexts/TaskContext";

// Mock providers for Storybook testing
export const MockProviders = ({ children }: { children: ReactNode }) => {
  return (
    <EditingProvider>
      <TaskProvider>{children}</TaskProvider>
    </EditingProvider>
  );
};
