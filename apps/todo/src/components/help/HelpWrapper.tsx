"use client";
import { type ReactNode, useState } from "react";
import { useEditing } from "~/contexts/EditingContext";
import { keybindings, KeybindingsHelp } from "./KeybindingsHelp";

export const HelpWrapper = ({ children }: { children: ReactNode }) => {
  const { editingState } = useEditing();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (editingState) {
      return;
    }
    if (e.key === keybindings.OPEN_HELP) {
      setIsHelpOpen((prev) => !prev);
    }
  };
  return (
    <div onKeyDown={handleKeyDown}>
      {isHelpOpen && <KeybindingsHelp />}
      {children}
    </div>
  );
};
