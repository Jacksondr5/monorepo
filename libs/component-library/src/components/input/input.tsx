import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

export const inputVariants = {
  size: {
    default: "h-9 px-3 py-1",
    sm: "h-8 px-2 py-1 text-xs",
    lg: "h-12 px-4 py-2 text-lg",
  },
  // We might add icon-specific padding variants here if needed,
  // but for now, dynamic padding in the component is fine.
};

const inputClassName = cva(
  "border-olive-7 shadow-xs file:text-olive-11 placeholder:text-olive-11 text-slate-12 focus-visible:ring-olive-7 focus-visible:outline-hidden flex w-full rounded-md border bg-transparent text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: inputVariants,
    defaultVariants: {
      size: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, // Omit the conflicting 'size'
    VariantProps<typeof inputClassName> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, icon, iconPosition = "left", ...props }, ref) => {
    const hasIcon = Boolean(icon);
    const iconSpacingClass =
      size === "sm" ? "pl-7 pr-2" : size === "lg" ? "pl-10 pr-4" : "pl-9 pr-3"; // Default padding for icon on left
    const iconSpacingClassRight =
      size === "sm" ? "pr-7 pl-2" : size === "lg" ? "pr-10 pl-4" : "pr-9 pl-3"; // Default padding for icon on right

    const inputPadding = hasIcon
      ? iconPosition === "left"
        ? iconSpacingClass.split(" ")[0] // e.g., pl-9
        : iconSpacingClassRight.split(" ")[0] // e.g., pr-9
      : "";

    const iconContainerClasses = cn(
      "absolute top-1/2 flex -translate-y-1/2 items-center justify-center",
      iconPosition === "left"
        ? size === "sm"
          ? "left-2"
          : size === "lg"
            ? "left-3"
            : "left-2.5"
        : size === "sm"
          ? "right-2"
          : size === "lg"
            ? "right-3"
            : "right-2.5",
      "text-muted-foreground peer-focus:text-foreground",
    );

    if (hasIcon) {
      return (
        <div
          className={cn(
            "relative flex w-full items-center",
            props.disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <div className={iconContainerClasses}>{icon}</div>
          <input
            type={type}
            data-slot="input"
            className={cn(
              inputClassName({ size }), // Apply base input styles
              inputPadding, // Apply padding for icon
              className, // Allow overriding with external className
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }

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
