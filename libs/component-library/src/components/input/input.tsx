import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils.js";

export const inputVariants = {
  size: {
    default: "h-9 px-3 py-1",
    sm: "h-8 px-2 py-1 text-xs",
    lg: "h-12 px-4 py-2 text-lg",
  },
};

const inputClassName = cva(
  "border-olive-7 shadow-xs file:text-olive-11 placeholder:text-olive-11 focus-visible:ring-olive-7 focus-visible:outline-hidden flex w-full rounded-md border bg-transparent text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: inputVariants,
    defaultVariants: {
      size: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, // Omit the conflicting 'size'
    VariantProps<typeof inputClassName> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputClassName({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
