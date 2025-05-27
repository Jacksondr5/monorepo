"use client";

import { Textarea, TextareaProps } from "./textarea";
import { useFieldContext } from "../form/form-contexts";
import { Label } from "../label/label";
import { cn } from "../../lib/utils";

export const FieldTextarea = ({
  label,
  className,
  ...props
}: Omit<TextareaProps, "value" | "onChange" | "onBlur" | "aria-invalid"> & {
  label: string;
}) => {
  const field = useFieldContext<string>();
  return (
    <div className={cn("grid w-full max-w-sm items-center gap-1.5", className)}>
      <Label htmlFor={field.name}>{label}</Label>
      <Textarea
        {...props}
        value={field.state.value || ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </div>
  );
};
