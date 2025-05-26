"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@j5/component-library";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { BoardsMenu } from "./boards-menu";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

export const AppSidebar = () => {
  return (
    <Sidebar defaultOpen={true} collapsible="icon">
      <SidebarHeader>
        <OrganizationSwitcher hidePersonal />
      </SidebarHeader>
      <SidebarContent>
        {/* Boards */}
        <BoardsMenu />

        {/* Settings */}
        <SidebarGroup>
          {/* <SidebarGroupLabel>Settings</SidebarGroupLabel> */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings" asChild>
                <Link href="/settings" aria-label="Settings">
                  <SettingsIcon />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
};
