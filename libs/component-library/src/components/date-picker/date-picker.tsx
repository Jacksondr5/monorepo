"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../button/button";
import { Calendar } from "../calendar/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  defaultMonth?: Date;
  error?: boolean;
  "aria-describedby"?: string;
  dataTestId: string;
}

/**
 * DatePicker component using design system primitives.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  "aria-label": ariaLabel,
  defaultMonth,
  error,
  "aria-describedby": ariaDescribedBy,
  dataTestId,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value,
  );
  // Sync controlled value
  React.useEffect(() => {
    setInternalDate(value);
  }, [value]);
  const handleSelect = (date: Date | undefined) => {
    setInternalDate(date);
    onChange?.(date);
  };
  return (
    <Popover dataTestId={`${dataTestId}-popover`}>
      <PopoverTrigger asChild>
        <Button
          dataTestId={dataTestId}
          variant="outline"
          className={cn(
            "w-full justify-start rounded-md px-4 py-2 text-left font-normal",
            !internalDate && "text-slate-9",
            className,
          )}
          aria-label={ariaLabel || placeholder}
          aria-disabled={disabled}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={ariaDescribedBy}
        >
          <CalendarIcon className={cn("mr-2 size-4", error && "text-red-9")} />
          <span
            data-testid={`${dataTestId}-date-picker-trigger-text`}
            className={cn("text-slate-9", error && "text-red-9")}
          >
            {internalDate ? (
              <span className={cn("text-slate-12", error && "text-red-9")}>
                {format(internalDate, "PPP")}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          dataTestId={`${dataTestId}-calendar`}
          mode="single"
          selected={internalDate}
          onSelect={handleSelect}
          initialFocus
          disabled={disabled}
          defaultMonth={defaultMonth}
        />
      </PopoverContent>
    </Popover>
  );
}
