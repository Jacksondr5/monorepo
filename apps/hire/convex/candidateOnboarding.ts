import { mutation } from "./_generated/server";
import { zCustomMutation } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { CandidateIdSchema } from "../src/server/zod/candidate";
import { OnboardingStepIdSchema } from "../src/server/zod/onboardingStep";
import { verifyCandidateExists } from "./model/candidates";

const candidateOnboardingMutation = zCustomMutation(mutation, NoOp);

export const toggleCompletedStep = candidateOnboardingMutation({
  args: {
    candidateId: CandidateIdSchema,
    stepId: OnboardingStepIdSchema,
  },
  handler: async (ctx, { candidateId, stepId }) => {
    const candidate = await verifyCandidateExists(ctx, { _id: candidateId });

    const currentCompletedSteps = candidate.completedOnboardingSteps || [];
    const isCurrentlyCompleted = currentCompletedSteps.includes(stepId);

    let updatedCompletedSteps;
    if (isCurrentlyCompleted) {
      // Remove the step
      updatedCompletedSteps = currentCompletedSteps.filter(
        (completedStepId) => completedStepId !== stepId,
      );
    } else {
      // Add the step
      updatedCompletedSteps = [...currentCompletedSteps, stepId];
    }

    await ctx.db.patch(candidateId, {
      completedOnboardingSteps: updatedCompletedSteps,
      updatedAt: Date.now(),
    });
  },
});
