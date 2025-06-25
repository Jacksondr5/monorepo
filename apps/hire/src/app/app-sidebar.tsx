"use client";
import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@j5/component-library";
import { SettingsIcon, ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import { BoardsMenu } from "./boards-menu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { OrganizationSelect } from "~/components/organization-select";
import { AddCandidateDialog } from "../components/candidate/add-candidate-dialog";

export const AppSidebar = () => {
  return (
    <Sidebar defaultOpen={true} collapsible="icon">
      <SidebarHeader>
        {/* <OrganizationSwitcher hidePersonal /> */}
        <OrganizationSelect />
      </SidebarHeader>
      <SidebarContent>
        <div className="p-2">
          <AddCandidateDialog />
        </div>
        {/* Boards */}
        <BoardsMenu />

        {/* Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Onboarding Overview" asChild>
                <Link href="/onboarding" aria-label="Onboarding Overview">
                  <ClipboardListIcon />
                  <span>Onboarding Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
          <SignInButton>
            <Button variant="default" dataTestId="sidebar-sign-in-button">
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <Button variant="ghost" dataTestId="sidebar-sign-out-button">
              Sign out
            </Button>
          </SignOutButton>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
};
