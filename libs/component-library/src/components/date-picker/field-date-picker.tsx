"use client";

import React, { useId } from "react";
import { useFieldContext } from "../form/form-contexts";
import { FormErrorMessage } from "../form/form-error-message";
import { DatePicker, DatePickerProps } from "./date-picker";
import { Label } from "../label/label";
import { cn } from "../../lib/utils";

export const FieldDatePicker = ({
  label,
  className,
  ...props
}: Omit<
  DatePickerProps,
  | "value"
  | "onChange"
  | "aria-invalid"
  | "error"
  | "aria-describedby"
  | "dataTestId"
> & {
  label: string;
}) => {
  const field = useFieldContext<number | undefined>();
  const {
    state: { meta },
  } = field;
  const localErrorId = useId();
  const hasError = meta.errors.length > 0;
  const describedBy = hasError ? localErrorId : undefined;

  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      <Label
        htmlFor={field.name}
        dataTestId={`${field.name}-label`}
        error={hasError}
      >
        {label}
      </Label>
      <DatePicker
        {...props}
        value={field.state.value ? new Date(field.state.value) : undefined}
        onChange={(e) => field.handleChange(e?.getTime())}
        error={hasError}
        aria-describedby={describedBy}
        dataTestId={`${field.name}-date-picker`}
      />
      {hasError && (
        <FormErrorMessage
          id={localErrorId}
          messages={meta.errors}
          dataTestId={`${field.name}-error`}
        />
      )}
    </div>
  );
};
