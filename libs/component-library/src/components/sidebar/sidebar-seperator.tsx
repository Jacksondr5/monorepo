import { Separator } from "@radix-ui/react-separator";
import { cn } from "../../lib/utils";

export function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-slate-6 h-px w-full", className)}
      {...props}
    />
  );
}
