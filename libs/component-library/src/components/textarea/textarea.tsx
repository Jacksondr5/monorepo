import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const textareaVariants = {
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
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaClassName> {}

const Textarea: React.FC<TextareaProps> = ({
  className,
  size,
  resize,
  ...props
}) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaClassName({ size, resize, className }))}
      {...props}
    />
  );
};
Textarea.displayName = "Textarea";

export { Textarea };
