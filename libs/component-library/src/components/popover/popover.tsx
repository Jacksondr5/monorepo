"use client";

import * as React from "react";
import { useContext } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../../lib/utils";

interface PopoverContextValue {
  dataTestId: string;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error(
      "Popover subcomponents must be used within a Popover provider",
    );
  }
  return context;
};

function Popover({
  dataTestId,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root> & {
  dataTestId: string;
}) {
  return (
    <PopoverContext.Provider value={{ dataTestId }}>
      <PopoverPrimitive.Root
        data-slot="popover"
        data-testid={dataTestId}
        {...props}
      />
    </PopoverContext.Provider>
  );
}

type PopoverTriggerProps = React.ComponentProps<
  typeof PopoverPrimitive.Trigger
>;

function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  const { dataTestId } = usePopoverContext();
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      data-testid={`${dataTestId}-trigger`}
      {...props}
    />
  );
}

type PopoverContentProps = React.ComponentProps<
  typeof PopoverPrimitive.Content
>;

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  const { dataTestId } = usePopoverContext();
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        data-testid={`${dataTestId}-content`}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Design system: popover bg, border, radius, shadow, animation
          "bg-olive-3 border-olive-6 text-slate-12 z-50 w-72 rounded-md border p-4 shadow-md outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "origin-[--radix-popover-content-transform-origin]",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

type PopoverAnchorProps = React.ComponentProps<typeof PopoverPrimitive.Anchor>;

function PopoverAnchor({ ...props }: PopoverAnchorProps) {
  const { dataTestId } = usePopoverContext();
  return (
    <PopoverPrimitive.Anchor
      data-slot="popover-anchor"
      data-testid={`${dataTestId}-anchor`}
      {...props}
    />
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
