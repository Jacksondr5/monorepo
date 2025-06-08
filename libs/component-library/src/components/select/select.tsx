"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { ComponentProps, createContext, useContext, useMemo } from "react";

interface SelectContextValue {
  error?: boolean;
  customAriaDescribedBy?: string;
  dataTestId?: string;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  // Return empty object if not in provider to avoid errors, or throw if strict usage is required
  return context || {};
};

export type SelectProps = ComponentProps<typeof SelectPrimitive.Root> & {
  error?: boolean;
  customAriaDescribedBy?: string;
  dataTestId: string;
};

function Select({
  children,
  error,
  customAriaDescribedBy,
  dataTestId, // Root dataTestId
  ...props
}: SelectProps) {
  const contextValue = useMemo(
    () => ({ error, customAriaDescribedBy, dataTestId }),
    [error, customAriaDescribedBy, dataTestId],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root
        data-slot="select"
        data-testid={dataTestId}
        {...props}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
}

function SelectGroup({
  ...props
}: ComponentProps<typeof SelectPrimitive.Group>) {
  const { dataTestId } = useSelectContext();
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      data-testid={dataTestId ? `${dataTestId}-group` : undefined}
      {...props}
    />
  );
}

function SelectValue({
  ...props
}: ComponentProps<typeof SelectPrimitive.Value>) {
  const { dataTestId, error } = useSelectContext();
  return (
    <span className={cn(error && "text-red-11")}>
      <SelectPrimitive.Value
        data-slot="select-value"
        data-testid={dataTestId ? `${dataTestId}-value` : undefined}
        {...props}
      />
    </span>
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  const { error, customAriaDescribedBy, dataTestId } = useSelectContext();

  const baseClasses = [
    // Layout and display
    "flex w-full items-center justify-between gap-2 whitespace-nowrap",
    // Design system: border, bg, radius, font, padding
    "bg-olive-2 border-olive-6 text-slate-12 shadow-xs rounded-md border px-3 py-2",
    "font-sans text-sm font-normal outline-none transition-[color,box-shadow]",
    // States
    "focus:border-grass-8 focus:ring-grass-8/50 focus:ring-2",
    "disabled:bg-olive-1 disabled:text-slate-8 disabled:border-olive-4",
    "aria-invalid:border-red-7 aria-invalid:ring-red-7/50", // Updated ring opacity
    // Size variants
    "data-[size=default]:h-9 data-[size=sm]:h-8",
    // Nested element styles
    "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ];
  return (
    <SelectPrimitive.Trigger
      aria-invalid={error || props["aria-invalid"]}
      aria-describedby={customAriaDescribedBy || props["aria-describedby"]}
      data-slot="select-trigger"
      data-testid={dataTestId ? `${dataTestId}-trigger` : undefined}
      data-size={size}
      className={cn(...baseClasses, className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          className={cn("size-4 opacity-50", error && "text-red-11")}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  const { dataTestId } = useSelectContext();
  const baseClasses = [
    // Design system: menu popover bg, border, radius, shadow
    "bg-olive-3 border-olive-6 text-slate-12 relative z-50 min-w-[8rem]",
    "overflow-y-auto overflow-x-hidden rounded-md border shadow-md",
    "max-h-(--radix-select-content-available-height)",
    "origin-(--radix-select-content-transform-origin)",
    // Animations
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ];

  const popperClasses =
    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1";

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-testid={dataTestId ? `${dataTestId}-content` : undefined}
        className={cn(
          ...baseClasses,
          position === "popper" && popperClasses,
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton
          dataTestId={dataTestId ? `${dataTestId}-scroll-up` : undefined}
        />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton
          dataTestId={dataTestId ? `${dataTestId}-scroll-down` : undefined}
        />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  const { dataTestId } = useSelectContext();
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      data-testid={dataTestId ? `${dataTestId}-label` : undefined}
      className={cn(
        "text-slate-11 px-2 py-1.5 font-sans text-xs font-medium",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  const { dataTestId } = useSelectContext();
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-testid={dataTestId ? `${dataTestId}-item-${props.value}` : undefined}
      className={cn(
        // Design system: item bg, text, radius, padding, states
        "text-slate-12 focus:bg-olive-4 focus:text-slate-12 aria-selected:bg-grass-3 aria-selected:text-slate-12 [&_svg:not([class*='text-'])]:text-slate-9 relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1.5 pl-2 pr-8 font-sans text-sm font-normal transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  const { dataTestId } = useSelectContext();
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      data-testid={dataTestId ? `${dataTestId}-separator` : undefined}
      className={cn(
        "border-olive-6 pointer-events-none -mx-1 my-1 h-px border-b",
        className,
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  dataTestId, // This will be passed directly from SelectContent
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton> & {
  dataTestId?: string;
}) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      data-testid={dataTestId}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  dataTestId, // This will be passed directly from SelectContent
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton> & {
  dataTestId?: string;
}) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      data-testid={dataTestId}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
