"use client";

import { Card, CardContent, Checkbox } from "@j5/component-library";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import type { ZodOnboardingOverviewData } from "~/server/zod/views/onboarding-overview";
import type { Id } from "../../../convex/_generated/dataModel";

function OnboardingTable({
  onboardingSteps,
  candidates,
}: {
  onboardingSteps: ZodOnboardingOverviewData["onboardingSteps"];
  candidates: ZodOnboardingOverviewData["candidates"];
}) {
  const toggleCompletedStep = useMutation(
    api.candidateOnboarding.toggleCompletedStep,
  );

  const handleStepToggle = async (
    candidateId: Id<"candidates">,
    stepId: Id<"onboardingSteps">,
  ) => {
    try {
      await toggleCompletedStep({
        candidateId,
        stepId,
      });
    } catch (error) {
      console.error("Failed to toggle onboarding step:", error);
      // TODO: Add toast notification
    }
  };

  const isStepCompleted = (
    candidate: ZodOnboardingOverviewData["candidates"][0],
    stepId: Id<"onboardingSteps">,
  ) => {
    return candidate.completedOnboardingSteps?.includes(stepId) || false;
  };

  const isAllStepsCompleted = (
    candidate: ZodOnboardingOverviewData["candidates"][0],
  ) => {
    if (!onboardingSteps.length) return false;
    // Check both root steps and their substeps
    const allSteps = onboardingSteps.flatMap((step) => [
      step,
      ...step.subSteps,
    ]);
    return allSteps.every(
      (step) => candidate.completedOnboardingSteps?.includes(step._id) || false,
    );
  };

  if (onboardingSteps.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No onboarding steps configured yet.
            <br />
            Configure them in Settings → Onboarding Steps.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Split steps into tables after 12 columns, breaking only at parent tasks
  const tableGroups: ZodOnboardingOverviewData["onboardingSteps"][] = [];
  let currentGroup: ZodOnboardingOverviewData["onboardingSteps"] = [];
  let currentColumnCount = 0;

  for (const rootStep of onboardingSteps) {
    const stepColumnCount = 1 + rootStep.subSteps.length;

    // If adding this step would exceed 12 columns and we have steps in current group, start new group
    if (currentColumnCount + stepColumnCount > 12 && currentGroup.length > 0) {
      tableGroups.push(currentGroup);
      currentGroup = [rootStep];
      currentColumnCount = stepColumnCount;
    } else {
      currentGroup.push(rootStep);
      currentColumnCount += stepColumnCount;
    }
  }

  // Add the last group if it has any steps
  if (currentGroup.length > 0) {
    tableGroups.push(currentGroup);
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Onboarding Progress</h3>

      {tableGroups.map((tableSteps, index) => {
        const tableColumns = tableSteps.flatMap((rootStep) => [
          rootStep,
          ...rootStep.subSteps,
        ]);

        return (
          <Card key={index}>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="p-4 text-left font-medium">Candidate</th>
                      {tableColumns.map((step) => (
                        <th
                          key={step._id}
                          className="min-w-[120px] p-4 text-center font-medium"
                        >
                          <div className="flex flex-col items-center">
                            <span
                              className={
                                step.parentStepId
                                  ? "text-xs"
                                  : "text-sm font-bold"
                              }
                            >
                              {step.name}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.length === 0 ? (
                      <tr>
                        <td
                          colSpan={tableColumns.length + 1}
                          className="text-muted-foreground p-8 text-center"
                        >
                          No candidates in the configured kanban stages.
                          <br />
                          Configure which stages to show in Settings →
                          Onboarding Overview.
                        </td>
                      </tr>
                    ) : (
                      candidates.map((candidate) => {
                        const allCompleted = isAllStepsCompleted(candidate);
                        return (
                          <tr
                            key={candidate._id}
                            className="hover:bg-muted/25 border-b"
                          >
                            <td className="p-4">
                              <div
                                className={`font-medium ${
                                  allCompleted
                                    ? "rounded bg-green-50 px-2 py-1 text-green-700 line-through"
                                    : ""
                                }`}
                              >
                                {candidate.name}
                              </div>
                            </td>
                            {tableColumns.map((step) => {
                              const isCompleted = isStepCompleted(
                                candidate,
                                step._id as Id<"onboardingSteps">,
                              );
                              return (
                                <td key={step._id} className="p-4 text-center">
                                  <Checkbox
                                    checked={isCompleted}
                                    onCheckedChange={() =>
                                      handleStepToggle(
                                        candidate._id,
                                        step._id as Id<"onboardingSteps">,
                                      )
                                    }
                                    dataTestId={`onboarding-step-${candidate._id}-${step._id}`}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const onboardingData = useQuery(
    api.onboardingOverview.getOnboardingOverviewData,
    orgId ? { orgId } : "skip",
  );

  if (!orgId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Please select an organization to view onboarding data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (onboardingData === undefined) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Onboarding Overview
          </h1>
          <p className="text-muted-foreground">
            Track onboarding progress across all candidates
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (onboardingData === null || onboardingData.onboardingSteps.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Onboarding Overview
          </h1>
          <p className="text-muted-foreground">
            Track onboarding progress across all candidates
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No onboarding steps configured yet.
              <br />
              Configure them in Settings → Onboarding Steps.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Onboarding Overview
        </h1>
        <p className="text-muted-foreground">
          Track onboarding progress across all candidates
        </p>
      </div>

      <OnboardingTable
        onboardingSteps={onboardingData.onboardingSteps}
        candidates={onboardingData.candidates}
      />
    </div>
  );
}
