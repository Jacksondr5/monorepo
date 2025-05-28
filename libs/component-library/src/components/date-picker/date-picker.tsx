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
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start rounded-md px-4 py-2 text-left font-normal",
            !internalDate && "text-slate-9",
            className,
          )}
          aria-label={ariaLabel || placeholder}
          aria-disabled={disabled}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 size-4" />
          {internalDate ? (
            format(internalDate, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
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
