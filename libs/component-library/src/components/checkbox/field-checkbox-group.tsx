"use client";

import * as React from "react";
import { Checkbox, type CheckboxProps } from "./checkbox";
import { useFieldContext } from "../form/form-contexts";
import { Label } from "../label/label";
import { cn } from "../../lib/utils";

export interface CheckboxGroupItem {
  id: string;
  label: string;
  // Allow any other props, e.g., disabled, custom styling, etc.
  [key: string]: any;
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

    const fieldItems = field.state.value || [];

    const handleCheckedChange = (itemId: string, checked: boolean) => {
      let newValue;
      if (checked) {
        newValue = [...fieldItems, itemId];
      } else {
        newValue = fieldItems.filter((id) => id !== itemId);
      }
      field.handleChange(newValue);
    };

    return (
      <div ref={ref} className={cn("space-y-2", className)} role="group">
        <Label htmlFor={field.name} className={labelClassName}>
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
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>
        {/* TODO: Consider how to display field errors for the group if needed */}
      </div>
    );
  },
);
