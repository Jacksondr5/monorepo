"use client";

import { Select, SelectProps } from "./select";
import { useFieldContext } from "../form/form-contexts";
import { Label } from "../label/label";
import { cn } from "../../lib/utils";

type FieldSelectProps = Omit<
  SelectProps,
  "value" | "onValueChange" | "onOpenChange" | "defaultValue" | "aria-invalid"
>;

export const FieldSelect = ({
  label,
  className,
  ...props
}: FieldSelectProps & {
  label: string;
  className?: string;
}) => {
  const field = useFieldContext<string>();

  return (
    <div className={cn("grid w-full max-w-sm items-center gap-1.5", className)}>
      <Label htmlFor={field.name}>{label}</Label>
      <Select
        {...props}
        value={field.state.value || ""}
        onValueChange={(value) => field.handleChange(value)}
        onOpenChange={(open) => !open && field.handleBlur()}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </div>
  );
};
