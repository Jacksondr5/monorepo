"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../lib/utils";

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn("flex flex-col gap-4", className)}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  className?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-start gap-1 rounded-md bg-olive-3 p-1 text-slate-11",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  className?: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
      "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-olive-3 data-[state=active]:text-slate-12 data-[state=active]:border-b-2 data-[state=active]:border-grass-9",
      "hover:bg-olive-4 hover:text-slate-12",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

interface TabsContentProps extends React.ComponentProps<typeof TabsPrimitive.Content> {
  className?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
