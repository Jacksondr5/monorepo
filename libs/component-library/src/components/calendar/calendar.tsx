"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../../lib/utils";
import { buttonClassName } from "../button/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  "aria-describedby"?: string;
  "aria-label"?: string;
  dataTestId: string;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  dataTestId,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      data-testid={dataTestId}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // Layout
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "font-sans text-sm font-medium text-slate-12",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonClassName({ variant: "outline" }),
          "bg-olive-2 border-olive-6 text-slate-12 focus:border-grass-8 focus:ring-grass-8/50 size-7 rounded-md p-0 opacity-50 transition-colors hover:opacity-100 focus:ring-2",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell: "text-slate-11  w-8 font-normal text-[0.8rem] font-sans",
        row: "flex w-full mt-2",
        cell: cn(
          // Selected day background, focus, and rounded corners
          "relative p-0 text-center font-sans text-sm focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonClassName({ variant: "ghost" }),
          "size-8 rounded-md p-0 font-normal transition-colors aria-selected:opacity-100",
        ),

        day_selected:
          "bg-grass-9 !text-grass-1 hover:bg-grass-10 hover:text-grass-1 focus:bg-grass-10 focus:text-grass-1",
        day_today: "bg-olive-4 text-slate-12",
        day_outside: "day-outside text-slate-8 aria-selected:text-slate-8",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
