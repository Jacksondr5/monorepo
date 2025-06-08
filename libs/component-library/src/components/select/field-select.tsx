"use client";

import * as React from "react";
import { Select, type SelectProps } from "./select";
import { FormErrorMessage } from "../form/form-error-message";
import { useFieldContext } from "../form/form-contexts";
import { Label } from "../label/label";
import { cn } from "../../lib/utils";

export interface FieldSelectProps
  extends Omit<
    SelectProps,
    | "value"
    | "onValueChange"
    | "onOpenChange"
    | "defaultValue"
    | "error"
    | "customAriaDescribedBy"
  > {
  label: string;
  className?: string;
}

export const FieldSelect = ({
  label,
  className,
  children,
  ...props
}: FieldSelectProps) => {
  const errorId = React.useId();
  const field = useFieldContext<string | undefined>(); // Value can be undefined initially
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      <Label
        htmlFor={field.name}
        dataTestId={`${field.name}-label`}
        error={hasError}
      >
        {label}
      </Label>
      <Select
        {...props}
        value={field.state.value || ""}
        onValueChange={(value) => field.handleChange(value)}
        onOpenChange={(open) => !open && field.handleBlur()} // Common Radix pattern for blur
        error={hasError}
        customAriaDescribedBy={hasError ? errorId : undefined}
      >
        {children}
      </Select>
      {hasError && (
        <FormErrorMessage
          id={errorId}
          messages={field.state.meta.errors as string[]}
          dataTestId={`${field.name}-error`}
        />
      )}
    </div>
  );
};
