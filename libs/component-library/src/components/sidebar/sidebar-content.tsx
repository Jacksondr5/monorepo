import { cn } from "../../lib/utils";

export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-4 group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}
