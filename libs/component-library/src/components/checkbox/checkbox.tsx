"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const checkboxVariants = cva(
  "border-olive-7 bg-olive-3 data-[state=checked]:bg-grass-9 data-[state=checked]:text-grass-1 data-[state=checked]:border-grass-9 focus-visible:ring-blue-8/50 aria-invalid:border-red-7 aria-invalid:ring-red-7/50 peer shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "size-4",
        lg: "size-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const iconVariants = cva(
  "", // No base class needed for the icon itself
  {
    variants: {
      size: {
        default: "size-3.5",
        lg: "size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  dataTestId: string;
}

function Checkbox({ className, size, dataTestId, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-testid={dataTestId}
      className={cn(checkboxVariants({ size, className }))}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className={cn(iconVariants({ size }))} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
