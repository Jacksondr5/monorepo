import * as React from "react";

import { cn } from "~/lib/utils";

export const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content border-olive-7 shadow-xs placeholder:text-olive-11 focus-visible:ring-olive-7 focus-visible:outline-hidden flex min-h-[60px] w-full resize-none rounded-md border bg-transparent px-3 py-2 text-base focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
};
