"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "~/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-slate-11 select-none font-sans text-base font-normal leading-none", // Base styles from design system
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50", // Disabled state via group
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50", // Disabled state via peer
        className,
      )}
      {...props}
    />
  );
}

export { Label };
