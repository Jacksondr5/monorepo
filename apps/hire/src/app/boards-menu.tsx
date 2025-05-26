"use client";

import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Folder } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarGroupLabel,
  SidebarMenu,
} from "@j5/component-library";
import { api } from "../../convex/_generated/api";

const Group = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>{children}</SidebarMenu>
    </SidebarGroup>
  );
};

export function BoardsMenu() {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const orgId = organization?.id;

  const boards = useQuery(
    api.boards.getBoardsByOrgId,
    orgId ? { orgId } : "skip",
  );

  const isLoading = !isOrgLoaded || boards === undefined;

  if (isLoading) {
    return (
      <Group label="Boards">
        <SidebarMenuItem>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      </Group>
    );
  }

  if (!boards || boards.length === 0) {
    return (
      <Group label="Boards">
        <span className="text-slate-11 px-2 py-1 text-sm">
          No boards found.
        </span>
      </Group>
    );
  }

  return (
    <Group label="Boards">
      {boards.map((board) => (
        <SidebarMenuItem key={board._id}>
          <SidebarMenuButton asChild tooltip={board.name} className="gap-x-2">
            <Link
              href={`/board/${board.slug}`}
              aria-label={`Open board ${board.name}`}
            >
              <Folder size={16} className="shrink-0" />
              <span className="truncate">{board.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </Group>
  );
}
