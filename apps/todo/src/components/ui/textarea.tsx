import * as React from "react";

import { cn } from "~/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex field-sizing-content min-h-[60px] w-full resize-none rounded-md border border-olive-7 bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-olive-11 focus-visible:ring-1 focus-visible:ring-olive-7 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
