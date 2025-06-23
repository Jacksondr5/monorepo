"use client";

import {
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@j5/component-library";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Trash2, Pencil, Plus } from "lucide-react";
import {
  OnboardingChecklist,
  EditOnboardingStepDialog,
  DeleteOnboardingStepDialog,
} from "~/components/onboarding";
import type { ZodOnboardingStep } from "~/server/zod/onboardingStep";

export function OnboardingStepsTab({ orgId }: { orgId: string }) {
  const [stepName, setStepName] = useState("");
  const [stepDetails, setStepDetails] = useState("");
  const [parentStepId, setParentStepId] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<ZodOnboardingStep | null>(
    null,
  );
  const [stepToDelete, setStepToDelete] = useState<{
    id: Id<"onboardingSteps">;
    name: string;
  } | null>(null);

  const steps =
    useQuery(api.onboardingSteps.getStepsByCompany, { orgId }) || [];
  const addStep = useMutation(api.onboardingSteps.addStep);

  // Filter to only show steps that could be parents (for the dropdown)
  const potentialParentSteps = steps.filter((step) => !step.parentStepId);

  const handleAddStep = async () => {
    if (!stepName.trim()) return;

    try {
      await addStep({
        orgId,
        name: stepName.trim(),
        details: stepDetails.trim() || undefined,
        parentStepId: (parentStepId || undefined) as
          | Id<"onboardingSteps">
          | undefined,
      });

      setStepName("");
      setStepDetails("");
      setParentStepId("");
    } catch (error) {
      console.error("Failed to add step:", error);
    }
  };

  const handleEditStep = (step: ZodOnboardingStep) => {
    setEditingStep(step);
    setIsEditDialogOpen(true);
  };

  const handleDeleteStep = (step: ZodOnboardingStep) => {
    setStepToDelete({ id: step._id, name: step.name });
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Onboarding Steps</h2>
        <p className="text-muted-foreground text-sm">
          Define the onboarding checklist for new hires
        </p>
      </div>

      {/* Add New Step Form */}
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Add New Step</h3>

        <div className="grid gap-4">
          <Input
            placeholder="Step name (required)"
            value={stepName}
            onChange={(e) => setStepName(e.target.value)}
            dataTestId="step-name-input"
          />

          <Textarea
            placeholder="Step details (optional)"
            value={stepDetails}
            onChange={(e) => setStepDetails(e.target.value)}
            dataTestId="step-details-input"
          />

          <Select
            value={parentStepId}
            onValueChange={setParentStepId}
            dataTestId="parent-step-select"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parent step (optional)" />
            </SelectTrigger>
            <SelectContent>
              {potentialParentSteps.map((step) => (
                <SelectItem key={step._id} value={step._id}>
                  {step.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleAddStep}
            disabled={!stepName.trim()}
            dataTestId="add-step-button"
            className="w-fit"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
        </div>
      </div>

      {/* Two Column Layout: Management + Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Steps Management */}
        <div className="space-y-4">
          <h3 className="font-medium">Manage Steps</h3>
          <div className="rounded-lg border">
            {steps.length === 0 ? (
              <p className="text-muted-foreground p-4 text-center">
                No onboarding steps created yet.
              </p>
            ) : (
              <ul className="divide-y">
                {steps.map((step) => (
                  <li
                    key={step._id}
                    className="flex items-start justify-between p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{step.name}</div>
                      {step.details && (
                        <div className="mt-1 text-sm text-gray-600">
                          {step.details}
                        </div>
                      )}
                      {step.parentStepId && (
                        <div className="mt-1 text-xs text-gray-500">
                          Parent:{" "}
                          {steps.find((s) => s._id === step.parentStepId)
                            ?.name || "Unknown"}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStep(step)}
                        dataTestId={`edit-step-${step._id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteStep(step)}
                        dataTestId={`delete-step-${step._id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="font-medium">Preview Checklist</h3>
          <div className="rounded-lg border p-4">
            <OnboardingChecklist
              orgId={orgId}
              isReadOnly={true}
              showDetails={true}
            />
          </div>
        </div>
      </div>

      <EditOnboardingStepDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        step={editingStep}
        orgId={orgId}
        onSuccess={() => setEditingStep(null)}
      />

      <DeleteOnboardingStepDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        stepId={stepToDelete?.id || null}
        stepName={stepToDelete?.name}
        orgId={orgId}
        onSuccess={() => setStepToDelete(null)}
      />
    </div>
  );
}
