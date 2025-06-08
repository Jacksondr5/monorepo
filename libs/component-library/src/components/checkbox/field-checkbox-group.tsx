"use client";

import React, { useCallback, useId } from "react";
import { Checkbox, type CheckboxProps } from "./checkbox";
import { useFieldContext } from "../form/form-contexts";
import { FormErrorMessage } from "../form/form-error-message";
import { Label } from "../label/label";
import { cn } from "../../lib/utils";

export interface CheckboxGroupItem {
  id: string;
  label: string;
}

export interface FieldCheckboxGroupProps
  extends Omit<
    CheckboxProps,
    "value" | "onCheckedChange" | "checked" | "defaultChecked" | "id"
  > {
  label: string;
  items: CheckboxGroupItem[];
  orientation?: "vertical" | "horizontal";
  itemClassName?: string;
  labelClassName?: string;
}

export const FieldCheckboxGroup = React.forwardRef<
  HTMLDivElement,
  FieldCheckboxGroupProps
>(
  (
    {
      label,
      items,
      className,
      itemClassName,
      labelClassName,
      orientation = "vertical",
      ...props // Passes common CheckboxProps like 'size' to individual checkboxes
    },
    ref,
  ) => {
    const field = useFieldContext<string[]>(); // Expects the field value to be an array of strings (IDs)
    const {
      state: { meta },
    } = field;
    const localErrorId = useId();
    const hasError = meta.errors.length > 0;
    // No help text functionality in this component, so only include errorId if present.
    const describedBy = hasError ? localErrorId : undefined;

    const fieldItems = field.state.value || [];

    const handleCheckedChange = useCallback(
      (itemId: string, checked: boolean) => {
        let newValue;
        if (checked) {
          newValue = [...fieldItems, itemId];
        } else {
          newValue = fieldItems.filter((id) => id !== itemId);
        }
        field.handleChange(newValue);
      },
      [fieldItems, field.handleChange],
    );

    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        role="group"
        aria-describedby={describedBy}
      >
        <Label
          htmlFor={field.name}
          className={labelClassName}
          dataTestId={`${field.name}-label`}
          error={hasError}
        >
          {label}
        </Label>
        <div
          className={cn(
            "flex",
            orientation === "vertical"
              ? "flex-col space-y-2"
              : "flex-row space-x-4",
          )}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={cn("flex items-center", itemClassName)}
            >
              <Checkbox
                {...props} // Pass down props like 'size'
                id={`${field.name}-${item.id}`}
                checked={fieldItems.includes(item.id)}
                onCheckedChange={(checked) => {
                  handleCheckedChange(item.id, Boolean(checked));
                }}
                onBlur={field.handleBlur} // Apply blur to the group or individual items as needed
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <Label
                htmlFor={`${field.name}-${item.id}`}
                className="ml-2 text-sm font-normal"
                dataTestId={`${field.name}-${item.id}-label`}
                error={hasError}
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>
        {hasError && (
          <FormErrorMessage
            id={localErrorId}
            messages={meta.errors}
            dataTestId={`${field.name}-error`}
          />
        )}
      </div>
    );
  },
);
