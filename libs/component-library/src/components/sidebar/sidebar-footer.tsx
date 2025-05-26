import { cn } from "../../lib/utils";

export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn(
        "border-slate-6 flex flex-col gap-2 border-t p-2",
        className,
      )}
      {...props}
    />
  );
}
