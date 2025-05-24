"use client";

import { Select, SelectProps } from "./select";
import { useFieldContext } from "../form/form-contexts";
import { Label } from "../label/label";

type FieldSelectProps = Omit<
  SelectProps,
  "value" | "onValueChange" | "onOpenChange" | "defaultValue" | "aria-invalid"
>;

export const FieldSelect = ({
  label,
  ...props
}: FieldSelectProps & {
  label: string;
}) => {
  const field = useFieldContext<string>();

  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Select
        {...props}
        value={field.state.value || ""}
        onValueChange={(value) => field.handleChange(value)}
        onOpenChange={(open) => !open && field.handleBlur()}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </>
  );
};
