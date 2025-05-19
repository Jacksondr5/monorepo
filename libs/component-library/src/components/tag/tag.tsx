import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const tagVariants = cva(
  "focus:ring-blue-7/50 inline-flex items-center rounded-md font-sans text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-olive-3 text-slate-12 hover:bg-olive-4",
        primary: "bg-grass-4 text-grass-11 hover:bg-grass-5",
        secondary: "bg-blue-4 text-blue-11 hover:bg-blue-5",
        success: "bg-green-4 text-green-11 hover:bg-green-5",
        warning: "bg-amber-4 text-amber-11 hover:bg-amber-5",
        error: "bg-red-4 text-red-11 hover:bg-red-5",
        outline:
          "border-olive-7 hover:bg-olive-3 text-slate-12 border bg-transparent",
      },
      size: {
        sm: "h-6 px-2 py-0.5 text-xs",
        md: "h-7 px-2.5 py-1 text-sm",
        lg: "h-8 px-3 py-1 text-sm",
      },
      rounded: {
        full: "rounded-full",
        md: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "md",
    },
  },
);

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  /**
   * Whether the tag is disabled
   */
  isDisabled?: boolean;
  /**
   * Callback when the close button is clicked
   */
  onDismiss?: () => void;
  /**
   * Custom icon to show before the tag text
   */
  icon?: React.ReactNode;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      isDisabled,
      onDismiss,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          tagVariants({ variant, size, rounded, className }),
          isDisabled && "cursor-not-allowed opacity-50",
          "group",
        )}
        aria-disabled={isDisabled}
        {...props}
      >
        {icon && <span className="mr-1.5">{icon}</span>}
        {children}
        {onDismiss && (
          <button
            type="button"
            onClick={handleDismiss}
            disabled={isDisabled}
            className="-mr-1 ml-1.5 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current disabled:opacity-50"
            aria-label="Remove tag"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  },
);

Tag.displayName = "Tag";

export { Tag, tagVariants };
