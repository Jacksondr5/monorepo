"use client";

import { Textarea, TextareaProps } from "./textarea";
import { useFieldContext } from "../form/form-contexts";
import { Label } from "../label/label";

export const FieldTextarea = ({
  label,
  ...props
}: Omit<TextareaProps, "value" | "onChange" | "onBlur" | "aria-invalid"> & {
  label: string;
}) => {
  const field = useFieldContext<string>();
  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Textarea
        {...props}
        value={field.state.value || ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </>
  );
};
