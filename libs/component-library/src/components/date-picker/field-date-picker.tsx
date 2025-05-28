"use client";

import { useFieldContext } from "../form/form-contexts";
import { DatePicker, DatePickerProps } from "./date-picker";
import { Label } from "../label/label";
import { cn } from "../../lib/utils";

export const FieldDatePicker = ({
  label,
  className,
  ...props
}: Omit<DatePickerProps, "value" | "onChange" | "aria-invalid"> & {
  label: string;
}) => {
  const field = useFieldContext<number | undefined>();

  return (
    <div className={cn("grid w-full max-w-sm items-center gap-1.5", className)}>
      <Label htmlFor={field.name}>{label}</Label>
      <DatePicker
        {...props}
        value={field.state.value ? new Date(field.state.value) : undefined}
        onChange={(e) => field.handleChange(e?.getTime())}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </div>
  );
};
