"use client";

import { SeniorityTab } from "./_components/seniority-tab";
import { RolesTab } from "./_components/roles-tab";
import { SourcesTab } from "./_components/sources-tab";
import { KanbanStagesTab } from "./_components/kanban-stages-tab";
import { BoardsTab } from "./_components/boards-tab";
import { useOrganization } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const { organization, isLoaded } = useOrganization();
  if (!isLoaded || !organization) return null;
  const orgId = organization.id;
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and preferences.
        </p>
      </div>

      <SeniorityTab orgId={orgId} />
      <RolesTab orgId={orgId} />
      <SourcesTab orgId={orgId} />
      <KanbanStagesTab orgId={orgId} />
      <BoardsTab orgId={orgId} />
    </div>
  );
}
