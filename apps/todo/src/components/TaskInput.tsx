"use client";

import { useState, useEffect } from "react";
import { Input, Textarea } from "@jacksondr5/component-library";

export type TaskInputProps = {
  type: "input" | "textarea";
  defaultValue: string;
  onChange: (value: string) => void;
  ref: React.RefObject<TaskInputRef | null>;
};

type TaskInputRef = HTMLInputElement | HTMLTextAreaElement;

export const TaskInput = ({
  type,
  defaultValue,
  onChange,
  ref,
}: TaskInputProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleKeyDown = (e: React.KeyboardEvent<TaskInputRef>) => {
    if (e.ctrlKey && e.key === "Enter") {
      onChange(e.currentTarget.value);
    }
  };

  useEffect(() => {
    if (ref?.current) {
      ref.current.focus();
    }
  }, [ref]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const sharedProps = {
    onChange: (e: React.ChangeEvent<TaskInputRef>) => setValue(e.target.value),
    onKeyDown: handleKeyDown,
    value: value,
  };
  return type === "textarea" ? (
    <Textarea
      ref={ref as React.RefObject<HTMLTextAreaElement>}
      dataTestId="task-textarea"
      {...sharedProps}
    />
  ) : (
    <Input
      ref={ref as React.RefObject<HTMLInputElement>}
      dataTestId="task-input"
      {...sharedProps}
    />
  );
};
