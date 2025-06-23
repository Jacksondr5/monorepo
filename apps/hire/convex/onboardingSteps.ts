import { mutation, query } from "./_generated/server";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  OnboardingStepIdSchema,
  OnboardingStepSchema,
  AddStepArgsSchema,
  RemoveStepArgsSchema,
  UpdateStepArgsSchema,
} from "../src/server/zod/onboardingStep";
import { getCompanyIdByClerkOrgId } from "./model/companies";
import { z } from "zod";

const onboardingStepQuery = zCustomQuery(query, NoOp);
const onboardingStepMutation = zCustomMutation(mutation, NoOp);

export const addStep = onboardingStepMutation({
  args: AddStepArgsSchema,
  handler: async (ctx, { orgId, name, details, parentStepId }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });

    // If parentStepId is provided, verify it exists and belongs to the same company
    if (parentStepId) {
      const parentStep = await ctx.db.get(parentStepId);
      if (!parentStep) {
        throw new Error("Parent step not found");
      }
      if (parentStep.companyId !== companyId) {
        throw new Error("Parent step does not belong to this organization");
      }
    }

    // Get the next order value for steps at this level
    const existingSteps = await ctx.db
      .query("onboardingSteps")
      .withIndex("by_parent", (q) => q.eq("parentStepId", parentStepId))
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .collect();

    const maxOrder = existingSteps.reduce(
      (max, step) => Math.max(max, step.order),
      0,
    );
    const newOrder = maxOrder + 1;

    const stepId = await ctx.db.insert("onboardingSteps", {
      companyId,
      name,
      details,
      parentStepId,
      order: newOrder,
    });

    return stepId;
  },
  returns: OnboardingStepIdSchema,
});

export const removeStep = onboardingStepMutation({
  args: RemoveStepArgsSchema,
  handler: async (ctx, { orgId, id }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });

    const step = await ctx.db.get(id);
    if (!step) {
      throw new Error("Onboarding step not found");
    }
    if (step.companyId !== companyId) {
      throw new Error("Onboarding step does not belong to this organization");
    }

    // Check if this step has any child steps
    const childSteps = await ctx.db
      .query("onboardingSteps")
      .withIndex("by_parent", (q) => q.eq("parentStepId", id))
      .collect();

    if (childSteps.length > 0) {
      throw new Error(
        "Cannot delete step that has child steps. Delete child steps first.",
      );
    }

    // Remove from any candidate completion lists
    const candidateOnboardingSteps = await ctx.db
      .query("candidateOnboardingSteps")
      .collect();

    for (const candidateSteps of candidateOnboardingSteps) {
      if (candidateSteps.completedSteps.includes(id)) {
        const updatedCompletedSteps = candidateSteps.completedSteps.filter(
          (stepId) => stepId !== id,
        );
        await ctx.db.patch(candidateSteps._id, {
          completedSteps: updatedCompletedSteps,
        });
      }
    }

    await ctx.db.delete(id);
  },
});

export const updateStep = onboardingStepMutation({
  args: UpdateStepArgsSchema,
  handler: async (ctx, { orgId, id, updatedStep }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });

    const existingStep = await ctx.db.get(id);
    if (!existingStep) {
      throw new Error("Onboarding step not found");
    }
    if (existingStep.companyId !== companyId) {
      throw new Error("Onboarding step does not belong to this organization");
    }

    // If parentStepId is being changed, verify the new parent exists and belongs to the same company
    if (
      updatedStep.parentStepId &&
      updatedStep.parentStepId !== existingStep.parentStepId
    ) {
      const parentStep = await ctx.db.get(updatedStep.parentStepId);
      if (!parentStep) {
        throw new Error("Parent step not found");
      }
      if (parentStep.companyId !== companyId) {
        throw new Error("Parent step does not belong to this organization");
      }
    }

    await ctx.db.patch(id, updatedStep);
  },
});

export const getStepsByCompany = onboardingStepQuery({
  args: { orgId: z.string() },
  handler: async (ctx, { orgId }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });

    const steps = await ctx.db
      .query("onboardingSteps")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .collect();

    return steps.map((step) => OnboardingStepSchema.parse(step));
  },
  returns: z.array(OnboardingStepSchema),
});
