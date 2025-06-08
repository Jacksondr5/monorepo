import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const textareaVariants = {
  error: {
    true: "border-red-7 focus-visible:ring-red-7/50 text-red-900 placeholder:text-red-400",
    false: "",
  },
  size: {
    default: "min-h-[80px] px-3 py-2 text-sm",
    sm: "min-h-[60px] px-2 py-1.5 text-xs",
    lg: "min-h-[100px] px-4 py-3 text-base",
  },
  resize: {
    none: "resize-none",
    vertical: "resize-y",
  },
};

const textareaClassName = cva(
  "border-olive-7 shadow-xs placeholder:text-slate-11 text-slate-12 focus-visible:ring-olive-7 focus-visible:outline-hidden flex w-full resize-none rounded-md border bg-transparent transition-colors focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: textareaVariants,
    defaultVariants: {
      size: "default",
      resize: "none",
      error: false,
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaClassName> {
  error?: boolean;
  dataTestId: string;
}

const Textarea: React.FC<TextareaProps> = ({
  className,
  size,
  resize,
  error,
  dataTestId,
  ...props
}) => {
  return (
    <textarea
      data-slot="textarea"
      data-testid={dataTestId}
      className={cn(textareaClassName({ size, resize, error, className }))}
      {...props}
    />
  );
};
Textarea.displayName = "Textarea";

export { Textarea };
