"use client";

import { SeniorityTab } from "./_components/seniority-tab";
import { RolesTab } from "./_components/roles-tab";
import { SourcesTab } from "./_components/sources-tab";
import { KanbanStagesTab } from "./_components/kanban-stages-tab";
import { BoardsTab } from "./_components/boards-tab";
import { TargetTeamTab } from "./_components/target-team-tab";
import { OnboardingStepsTab } from "./_components/onboarding-steps-tab";
import { useOrganization } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const { organization, isLoaded } = useOrganization();
  if (!isLoaded || !organization) return null;
  const orgId = organization.id;
  return (
    <div className="mx-auto flex w-full flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and preferences.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <SeniorityTab orgId={orgId} />
        <RolesTab orgId={orgId} />
        <SourcesTab orgId={orgId} />
        <TargetTeamTab orgId={orgId} />
        <BoardsTab orgId={orgId} />
        <KanbanStagesTab orgId={orgId} />
      </div>

      {/* Onboarding Steps - Full Width */}
      <div className="w-full">
        <OnboardingStepsTab orgId={orgId} />
      </div>
    </div>
  );
}
