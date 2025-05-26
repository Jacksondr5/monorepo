import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { SidebarItem } from "./sidebar-item";
import { Home, Settings, Bell } from "lucide-react"; // Keep other icons for individual stories if needed

const meta: Meta<typeof SidebarItem> = {
  title: "Components/Sidebar/SidebarItem",
  component: SidebarItem,
  parameters: {
    // layout: "centered", // Remove centered for AllVariants to allow wider layout
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
    },
    children: {
      control: "text",
    },
    isActive: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    isCollapsed: {
      control: "boolean",
    },
    onClick: { action: "clicked" },
  },
  args: {
    children: "Sidebar Item",
    isActive: false,
    disabled: false,
    isCollapsed: false,
    onClick: fn(),
    // Use Home icon as a default for argTypes if needed, or rely on story-specific args
    icon: <Home className="size-4" />,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true },
    layout: "padded", // Use padded layout for AllVariants to give it space
  },
  render: (args) => {
    const commonIcon = <Home className="size-4" />;
    // Base args for items, icon will be overridden if needed by a specific variant
    const baseItemArgs = { ...args, icon: commonIcon };

    return (
      <div className="flex flex-row items-start gap-8 p-4">
        {/* Expanded Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-slate-12 mb-2 text-lg font-semibold">Expanded</h3>
          <div className="bg-slate-1 flex w-[280px] flex-col gap-4 rounded-md p-4 dark:bg-slate-800">
            <SidebarItem {...baseItemArgs} isCollapsed={false}>
              Default Item
            </SidebarItem>
            <SidebarItem {...baseItemArgs} isCollapsed={false} isActive>
              Active Item
            </SidebarItem>
            <SidebarItem {...baseItemArgs} isCollapsed={false} disabled>
              Disabled Item
            </SidebarItem>
            <SidebarItem {...baseItemArgs} isCollapsed={false}>
              Item with a very long name that should be truncated to fit
            </SidebarItem>
          </div>
        </div>

        {/* Collapsed Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-slate-12 mb-2 text-lg font-semibold">
            Collapsed
          </h3>
          <div className="bg-slate-1 flex w-auto flex-col gap-4 rounded-md p-4 dark:bg-slate-800">
            <SidebarItem
              {...baseItemArgs}
              isCollapsed={true}
              aria-label="Default Collapsed"
            >
              Default Collapsed
            </SidebarItem>
            <SidebarItem
              {...baseItemArgs}
              isCollapsed={true}
              isActive
              aria-label="Active Collapsed"
            >
              Active Collapsed
            </SidebarItem>
            <SidebarItem
              {...baseItemArgs}
              isCollapsed={true}
              disabled
              aria-label="Disabled Collapsed"
            >
              Disabled Collapsed
            </SidebarItem>
          </div>
        </div>
      </div>
    );
  },
};

export const ClickTest: Story = {
  args: {
    children: "Click Me",
    icon: <Home className="size-4" />,
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole("button", { name: /Click Me/i });

    await step("Ensure item is visible and not disabled", async () => {
      expect(item).toBeVisible();
      expect(item).not.toBeDisabled();
    });

    await step("Simulate user click", async () => {
      await userEvent.click(item);
      expect(args.onClick).toHaveBeenCalledTimes(1);
    });
    // Removed unused 'disabledItem' variable
  },
};

export const DisabledClickTest: Story = {
  name: "Test: Disabled Item Click",
  args: {
    children: "Cannot Click Me",
    icon: <Settings className="size-4" />,
    disabled: true,
    onClick: fn(),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole("button", { name: /Cannot Click Me/i });

    await step("Ensure item is disabled", async () => {
      expect(item).toBeDisabled();
    });

    await step("Attempt to click disabled item", async () => {
      await userEvent.click(item, { pointerEventsCheck: 0 });
      expect(args.onClick).not.toHaveBeenCalled();
    });
  },
};
