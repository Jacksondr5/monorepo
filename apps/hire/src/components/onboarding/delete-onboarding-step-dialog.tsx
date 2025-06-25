"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@j5/component-library";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface DeleteOnboardingStepDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stepId: Id<"onboardingSteps"> | null;
  stepName?: string;
  orgId: string;
  onSuccess?: () => void;
}

export function DeleteOnboardingStepDialog({
  isOpen,
  onOpenChange,
  stepId,
  stepName,
  orgId,
  onSuccess,
}: DeleteOnboardingStepDialogProps) {
  const removeStep = useMutation(api.onboardingSteps.removeStep);

  const executeDeleteStep = async () => {
    if (!stepId) return;

    try {
      await removeStep({ orgId, id: stepId });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete step:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Onboarding Step</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center">
            Are you sure you want to delete{" "}
            {stepName ? (
              <>
                the step &ldquo;<strong>{stepName}</strong>&rdquo;
              </>
            ) : (
              "this onboarding step"
            )}
            ?
          </p>
          <p className="text-muted-foreground text-center text-sm">
            This action cannot be undone and will remove it from all candidate
            checklists.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" dataTestId="delete-step-cancel">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={executeDeleteStep}
            dataTestId="delete-step-confirm"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
