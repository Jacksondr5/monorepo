"use client";

import {
  Button,
  Input,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import type { Id } from "../../../convex/_generated/dataModel";
import type { ZodOnboardingStep } from "~/server/zod/onboardingStep";

interface EditOnboardingStepDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  step: ZodOnboardingStep | null;
  orgId: string;
  onSuccess?: () => void;
}

export function EditOnboardingStepDialog({
  isOpen,
  onOpenChange,
  step,
  orgId,
  onSuccess,
}: EditOnboardingStepDialogProps) {
  const [stepName, setStepName] = useState("");
  const [stepDetails, setStepDetails] = useState("");
  const [parentStepId, setParentStepId] = useState<string>("");

  const steps =
    useQuery(api.onboardingSteps.getStepsByCompany, { orgId }) || [];
  const updateStep = useMutation(api.onboardingSteps.updateStep);

  // Filter to only show steps that could be parents (for the dropdown)
  const potentialParentSteps = steps.filter((s) => !s.parentStepId);

  useEffect(() => {
    if (step) {
      setStepName(step.name);
      setStepDetails(step.details || "");
      setParentStepId(step.parentStepId || "");
    } else {
      resetForm();
    }
  }, [step]);

  const resetForm = () => {
    setStepName("");
    setStepDetails("");
    setParentStepId("");
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const handleUpdateStep = async () => {
    if (!step || !stepName.trim()) return;

    try {
      await updateStep({
        orgId,
        id: step._id,
        updatedStep: {
          _id: step._id,
          name: stepName.trim(),
          details: stepDetails.trim() || undefined,
          parentStepId: (parentStepId || undefined) as
            | Id<"onboardingSteps">
            | undefined,
          order: step.order,
        },
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Failed to update step:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Onboarding Step</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Step name (required)"
            value={stepName}
            onChange={(e) => setStepName(e.target.value)}
            dataTestId="edit-step-name-input"
          />

          <Textarea
            placeholder="Step details (optional)"
            value={stepDetails}
            onChange={(e) => setStepDetails(e.target.value)}
            dataTestId="edit-step-details-input"
          />

          <Select
            value={parentStepId}
            onValueChange={setParentStepId}
            dataTestId="edit-parent-step-select"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parent step (optional)" />
            </SelectTrigger>
            <SelectContent>
              {potentialParentSteps
                .filter((s) => s._id !== step?._id) // Can't be parent of itself
                .map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" dataTestId="edit-step-cancel">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleUpdateStep}
            disabled={!stepName.trim()}
            dataTestId="edit-step-save"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
