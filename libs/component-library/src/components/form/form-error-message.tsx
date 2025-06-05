import React from "react";
import { cn } from "../../lib/utils";
import { AlertCircleIcon } from "lucide-react";

export interface FormErrorMessageProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export const FormErrorMessage = React.forwardRef<
  HTMLDivElement,
  FormErrorMessageProps
>(({ className, children, id }, ref) => {
  if (!children) {
    return null;
  }

  return (
    <div
      ref={ref}
      id={id}
      aria-live="polite"
      className={cn(
        "text-tomato-11 mt-1 flex items-center gap-1 text-sm font-medium",
        className,
      )}
    >
      <AlertCircleIcon className="h-3.5 w-3.5" />
      <span>{children}</span>
    </div>
  );
});

FormErrorMessage.displayName = "FormErrorMessage";
