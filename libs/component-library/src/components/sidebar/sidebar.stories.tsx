import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  Home,
  Settings,
  Users,
  Folder,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react";

import { Sidebar } from "./sidebar";
import { SidebarItem } from "../sidebar-item/sidebar-item";
import { Button } from "../button/button";
import { SidebarProvider } from "./sidebar-provider";
import { SidebarTrigger } from "./sidebar-trigger";
import { SidebarInset } from "./sidebar-inset";
import { SidebarHeader } from "./sidebar-header";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarSeparator } from "./sidebar-seperator";
import { SidebarContent } from "./sidebar-content";
import { SidebarGroup, SidebarGroupLabel } from "./sidebar-group";
import { SidebarMenu } from "./sidebar-menu";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  subcomponents: {
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarItem,
    SidebarSeparator,
    SidebarInset,
  },
  argTypes: {
    children: { control: false },
    className: { control: false },
    // mobileBehavior, defaultOpen, side, variant, collapsible will be set in individual story args
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="bg-slate-2 flex h-full min-h-screen w-full">
          <Story />
          <SidebarInset>
            <div className="border-slate-6 bg-slate-2 text-slate-11 flex h-12 items-center border-b px-4">
              <p>Main Content Area</p>
            </div>
            <div className="bg-slate-2 text-slate-11 p-4">
              <p>
                This is where the main application content would go, next to the
                sidebar.
              </p>
            </div>
            <SidebarTrigger />
          </SidebarInset>
        </div>
      </SidebarProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

const sidebarContentItems = (
  <>
    <SidebarHeader className="p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold group-data-[state=collapsed]:hidden">
          My App
        </h2>
        <SidebarTrigger />
      </div>
    </SidebarHeader>
    <SidebarContent className="flex-grow overflow-y-auto p-2">
      <SidebarGroup>
        <SidebarMenu>
          <SidebarItem icon={<Home size={18} />} title="Dashboard" />
          <SidebarItem icon={<Users size={18} />} title="Members" />
          <SidebarItem icon={<Folder size={18} />} title="Projects" />
          <SidebarItem icon={<MessageSquare size={18} />} title="Discussions" />
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarMenu>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarItem icon={<Settings size={18} />} title="Settings" />
          <SidebarItem icon={<HelpCircle size={18} />} title="Support" />
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarMenu>
          <SidebarItem icon={<LogOut size={18} />} title="Log Out" />
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter className="p-2 group-data-[state=collapsed]:p-0">
      <div className="group-data-[state=collapsed]:hidden">
        <Button variant="outline" size="sm" className="w-full">
          Placeholder Footer Button
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="hidden w-full group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center"
      >
        <Settings />
        <span className="sr-only">Settings</span>
      </Button>
    </SidebarFooter>
  </>
);

export const DefaultExpanded: Story = {
  name: "Default (Left, Expanded, Icon Collapsible)",
  args: {
    side: "left",
    variant: "sidebar",
    collapsible: "icon",
    defaultOpen: true,
    children: sidebarContentItems,
    mobileBehavior: "icon",
  },
};

export const DefaultCollapsed: Story = {
  name: "Default (Left, Collapsed, Icon Collapsible)",
  args: {
    side: "left",
    variant: "sidebar",
    collapsible: "icon",
    defaultOpen: false,
    children: sidebarContentItems,
    mobileBehavior: "icon",
  },
};
