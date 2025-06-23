"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Checkbox } from "@j5/component-library";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ZodOnboardingStep } from "~/server/zod/onboardingStep";

interface OnboardingChecklistProps {
  orgId: string;
  completedStepIds?: string[];
  onStepToggle?: (stepId: string, isCompleted: boolean) => void;
  isReadOnly?: boolean;
  showDetails?: boolean;
}

interface StepWithChildren extends ZodOnboardingStep {
  children: StepWithChildren[];
}

export function OnboardingChecklist({
  orgId,
  completedStepIds = [],
  onStepToggle,
  isReadOnly = false,
  showDetails = false,
}: OnboardingChecklistProps) {
  const steps =
    useQuery(api.onboardingSteps.getStepsByCompany, { orgId }) || [];
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  // Build hierarchical structure
  const hierarchicalSteps = useMemo(() => {
    const stepMap = new Map<string, StepWithChildren>();
    const rootSteps: StepWithChildren[] = [];

    // First pass: create all step objects
    steps.forEach((step) => {
      stepMap.set(step._id, { ...step, children: [] });
    });

    // Second pass: build hierarchy
    steps.forEach((step) => {
      const stepWithChildren = stepMap.get(step._id)!;

      if (step.parentStepId) {
        const parent = stepMap.get(step.parentStepId);
        if (parent) {
          parent.children.push(stepWithChildren);
        }
      } else {
        rootSteps.push(stepWithChildren);
      }
    });

    // Sort by order
    const sortSteps = (stepsToSort: StepWithChildren[]) => {
      stepsToSort.sort((a, b) => a.order - b.order);
      stepsToSort.forEach((step) => sortSteps(step.children));
    };

    sortSteps(rootSteps);
    return rootSteps;
  }, [steps]);

  const toggleExpanded = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const renderStep = (step: StepWithChildren, depth = 0) => {
    const isCompleted = completedStepIds.includes(step._id);
    const hasChildren = step.children.length > 0;
    const isExpanded = expandedSteps.has(step._id);

    return (
      <div key={step._id} className={`${depth > 0 ? "ml-6" : ""}`}>
        <div className="flex items-start gap-2 py-2">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(step._id)}
              className="mt-1 rounded p-0.5 hover:bg-gray-100"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-5" /> // Spacer for alignment
          )}

          <Checkbox
            checked={isCompleted}
            disabled={isReadOnly}
            onCheckedChange={(checked) => {
              if (!isReadOnly && onStepToggle) {
                onStepToggle(step._id, !!checked);
              }
            }}
            className="mt-1"
            dataTestId={`onboarding-step-${step._id}`}
          />

          <div className="min-w-0 flex-1">
            <div
              className={`font-medium ${isCompleted ? "text-gray-500 line-through" : ""}`}
            >
              {step.name}
            </div>
            {showDetails && step.details && (
              <div className="mt-1 text-sm text-gray-600">{step.details}</div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2 border-l border-gray-200">
            {step.children.map((childStep) => renderStep(childStep, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (steps.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No onboarding steps configured yet.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {hierarchicalSteps.map((step) => renderStep(step))}
    </div>
  );
}
