import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

export const badgeVariants = {
  variant: {
    // Neutrals
    olive: "bg-olive-3 text-olive-11",
    oliveOutline: "border border-olive-7 text-olive-11 bg-transparent",
    slate: "bg-slate-3 text-slate-11",
    slateOutline: "border border-slate-7 text-slate-11 bg-transparent",
    // Brand Accent
    grass: "bg-grass-3 text-grass-11",
    grassOutline: "border border-grass-7 text-grass-11 bg-transparent",
    // Semantic
    green: "bg-green-3 text-green-11", // Success
    greenOutline: "border border-green-7 text-green-11 bg-transparent",
    red: "bg-red-3 text-red-11", // Error
    redOutline: "border border-red-7 text-red-11 bg-transparent",
    amber: "bg-amber-3 text-amber-11", // Warning
    amberOutline: "border border-amber-7 text-amber-11 bg-transparent",
    blue: "bg-blue-3 text-blue-11", // Info
    blueOutline: "border border-blue-7 text-blue-11 bg-transparent",
  },
  shape: {
    default: "rounded-sm",
    pill: "rounded-full",
  },
};

const badgeClassName = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap border border-transparent px-2 py-0.5 font-sans text-xs font-medium [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: badgeVariants,
    defaultVariants: {
      variant: "olive",
      shape: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeClassName> {
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  shape,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeClassName({ variant, shape }), className)}
      {...props}
    />
  );
}

export { Badge };
