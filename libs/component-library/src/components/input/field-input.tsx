"use client";

import { useFieldContext } from "../form/form-contexts";
import { Input, InputProps } from "./input";
import { Label } from "../label/label";
import { cn } from "../../lib/utils";

export const FieldInput = ({
  label,
  className,
  ...props
}: Omit<InputProps, "value" | "onChange" | "onBlur" | "aria-invalid"> & {
  label: string;
}) => {
  const field = useFieldContext<string>();
  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        {...props}
        value={field.state.value || ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </div>
  );
};
