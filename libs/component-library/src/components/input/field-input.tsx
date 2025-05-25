"use client";

import { useFieldContext } from "../form/form-contexts";
import { Input, InputProps } from "./input";
import { Label } from "../label/label";

export const FieldInput = ({
  label,
  ...props
}: Omit<InputProps, "value" | "onChange" | "onBlur" | "aria-invalid"> & {
  label: string;
}) => {
  const field = useFieldContext<string>();
  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        {...props}
        value={field.state.value || ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </>
  );
};
