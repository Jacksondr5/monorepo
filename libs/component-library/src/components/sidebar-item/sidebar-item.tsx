import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { SidebarMenuButton, SidebarMenuItem } from "../sidebar/sidebar-menu";

const sidebarItemVariants = cva(
  "focus-visible:ring-ring group flex w-full items-center rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-slate-11 hover:bg-slate-3 dark:text-slate-11 dark:hover:bg-slate-4",
        danger:
          "text-red-11 hover:bg-red-3 dark:text-red-11 dark:hover:bg-red-4",
      },
      isActive: {
        true: "bg-slate-4 text-slate-12 hover:bg-slate-5 dark:bg-slate-5 dark:text-slate-12 dark:hover:bg-slate-6",
        false: "", // Applied by variant
      },
      isCollapsed: {
        // Placeholder for when sidebar context is integrated
        true: "justify-center px-2 py-2", // Icon only, smaller padding
        false: "px-3 py-2", // Icon and text, standard padding
      },
    },
    defaultVariants: {
      variant: "default",
      isActive: false,
      isCollapsed: false,
    },
  },
);

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarItemVariants> {
  icon: React.ReactNode;
  children?: React.ReactNode; // Made children optional for icon-only items if needed
}

const SidebarItem = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={title}>
        {icon}
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
SidebarItem.displayName = "SidebarItem";

export { SidebarItem, sidebarItemVariants };
