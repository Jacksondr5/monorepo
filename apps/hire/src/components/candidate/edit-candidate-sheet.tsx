"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Separator,
} from "@j5/component-library";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CandidateForm } from "./candidate-form";
import { OnboardingChecklist } from "~/components/onboarding";
import {
  ZodCandidate,
  ZodUpdateCandidate,
  UpdateCandidateSchema,
} from "~/server/zod/candidate";
import { OnboardingStepId } from "~/server/zod/onboardingStep";

interface EditCandidateSheetProps {
  candidate: ZodCandidate;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  organizationId: string;
  onSubmit: (values: ZodUpdateCandidate) => Promise<void>; // Or appropriate callback
}

export function EditCandidateSheet({
  candidate,
  isOpen,
  onOpenChange,
  organizationId,
  onSubmit,
}: EditCandidateSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toggleCompletedStep = useMutation(
    api.candidateOnboarding.toggleCompletedStep,
  );

  const handleSubmit = async (values: ZodUpdateCandidate) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onOpenChange(false); // Close sheet on successful submit
    } catch (error) {
      console.error("Failed to update candidate:", error);
      // TODO: Add toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepToggle = async (stepId: string) => {
    try {
      await toggleCompletedStep({
        candidateId: candidate._id,
        stepId: stepId as OnboardingStepId,
      });
    } catch (error) {
      console.error("Failed to toggle onboarding step:", error);
      // TODO: Add toast notification
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-4xl">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Edit Candidate</SheetTitle>
          <SheetDescription>
            Update the details for {candidate.name}.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-6 overflow-y-auto py-4">
          <CandidateForm
            initialData={candidate}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            organizationId={organizationId}
            schema={UpdateCandidateSchema}
          />

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-semibold">Onboarding Checklist</h3>
            <OnboardingChecklist
              orgId={organizationId}
              completedStepIds={candidate.completedOnboardingSteps || []}
              onStepToggle={handleStepToggle}
              isReadOnly={false}
              showDetails={true}
            />
          </div>
        </div>
        {/* SheetFooter can be used if CandidateForm doesn't have its own submit button area */}
        {/* <SheetFooter>
          <Button type="submit" form="candidate-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
