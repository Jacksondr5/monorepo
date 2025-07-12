"use client";

import { createContext, useContext, type ReactNode, useState } from "react";

export type EditingState = {
  target: "title" | "description";
  taskCreatedAtTimestamp: string;
};

// Define the context type
type EditingContextType = {
  editingState?: EditingState;
  setEditingState: (state?: EditingState) => void;
};

// Create context with a default value
const EditingContext = createContext<EditingContextType | undefined>(undefined);

// Create provider component
export function EditingProvider({ children }: { children: ReactNode }) {
  const [editingState, setEditingState] = useState<EditingState | undefined>(
    undefined,
  );

  return (
    <EditingContext.Provider
      value={{
        editingState,
        setEditingState,
      }}
    >
      {children}
    </EditingContext.Provider>
  );
}

// Create custom hook for using this context
export function useEditing() {
  const context = useContext(EditingContext);
  if (context === undefined) {
    throw new Error("useEditing must be used within a EditingProvider");
  }
  return context;
}
