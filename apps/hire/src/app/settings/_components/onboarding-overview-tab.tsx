"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
} from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { KanbanStageId, ZodKanbanStage } from "~/server/zod/kanbanStage";

interface OnboardingOverviewTabProps {
  orgId: string;
}

export function OnboardingOverviewTab({ orgId }: OnboardingOverviewTabProps) {
  const configuration = useQuery(api.configuration.getConfiguration, { orgId });
  const kanbanStages = useQuery(api.kanbanStages.getKanbanStages, {
    orgId,
  });
  const updateStages = useMutation(
    api.configuration.updateOnboardingOverviewStages,
  );

  const handleStageToggle = async (
    stageId: KanbanStageId,
    checked: boolean,
  ) => {
    if (!configuration) return;

    const currentStageIds = configuration.onboardingOverviewKanbanStages || [];
    let newStageIds: KanbanStageId[];

    if (checked) {
      newStageIds = [...currentStageIds, stageId];
    } else {
      newStageIds = currentStageIds.filter((id) => id !== stageId);
    }

    try {
      await updateStages({
        orgId,
        kanbanStageIds: newStageIds,
      });
    } catch (error) {
      console.error("Failed to update onboarding overview stages:", error);
      // TODO: Add toast notification
    }
  };

  if (!kanbanStages || !configuration) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Overview</CardTitle>
          <CardDescription>
            Select which kanban stages to include in the onboarding overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboarding Overview</CardTitle>
        <CardDescription>
          Select which kanban stages to include in the onboarding overview. Only
          candidates in these stages will be shown on the onboarding page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {kanbanStages.map((stage: ZodKanbanStage) => (
            <div key={stage._id} className="flex items-center space-x-2">
              <Checkbox
                id={`stage-${stage._id}`}
                checked={configuration.onboardingOverviewKanbanStages.includes(
                  stage._id,
                )}
                onCheckedChange={(checked) =>
                  handleStageToggle(stage._id, checked === true)
                }
                dataTestId={`stage-checkbox-${stage._id}`}
              />
              <label
                htmlFor={`stage-${stage._id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {stage.name}
              </label>
            </div>
          ))}
        </div>

        {kanbanStages.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No kanban stages found. Create some stages first.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
