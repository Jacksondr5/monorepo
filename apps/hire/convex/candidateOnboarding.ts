import { mutation, query } from "./_generated/server";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { CandidateIdSchema } from "../src/server/zod/candidate";
import { OnboardingStepIdSchema } from "../src/server/zod/onboardingStep";
import { getCandidateById, verifyCandidateExists } from "./model/candidates";
import { z } from "zod";

const candidateOnboardingQuery = zCustomQuery(query, NoOp);
const candidateOnboardingMutation = zCustomMutation(mutation, NoOp);

// export const addCompletedStep = candidateOnboardingMutation({
//   args: {
//     candidateId: CandidateIdSchema,
//     stepId: OnboardingStepIdSchema,
//   },
//   handler: async (ctx, { candidateId, stepId }) => {
//     const candidate = await verifyCandidateExists(ctx, { _id: candidateId });

//     const currentCompletedSteps = candidate.completedOnboardingSteps || [];

//     // Don't add if already completed
//     if (currentCompletedSteps.includes(stepId)) {
//       return;
//     }

//     const updatedCompletedSteps = [...currentCompletedSteps, stepId];

//     await ctx.db.patch(candidateId, {
//       completedOnboardingSteps: updatedCompletedSteps,
//       updatedAt: Date.now(),
//     });
//   },
// });

// export const removeCompletedStep = candidateOnboardingMutation({
//   args: {
//     candidateId: CandidateIdSchema,
//     stepId: OnboardingStepIdSchema,
//   },
//   handler: async (ctx, { candidateId, stepId }) => {
//     const candidate = await verifyCandidateExists(ctx, { _id: candidateId });

//     const currentCompletedSteps = candidate.completedOnboardingSteps || [];
//     const updatedCompletedSteps = currentCompletedSteps.filter(
//       (completedStepId) => completedStepId !== stepId,
//     );

//     await ctx.db.patch(candidateId, {
//       completedOnboardingSteps: updatedCompletedSteps,
//       updatedAt: Date.now(),
//     });
//   },
// });

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

// export const getCompletedSteps = candidateOnboardingQuery({
//   args: { candidateId: CandidateIdSchema },
//   handler: async (ctx, { candidateId }) => {
//     const candidate = await getCandidateById(ctx, { _id: candidateId });
//     return candidate.completedOnboardingSteps || [];
//   },
//   returns: z.array(OnboardingStepIdSchema),
// });

// export const setCompletedSteps = candidateOnboardingMutation({
//   args: {
//     candidateId: CandidateIdSchema,
//     completedSteps: z.array(OnboardingStepIdSchema),
//   },
//   handler: async (ctx, { candidateId, completedSteps }) => {
//     await verifyCandidateExists(ctx, { _id: candidateId });

//     await ctx.db.patch(candidateId, {
//       completedOnboardingSteps: completedSteps,
//       updatedAt: Date.now(),
//     });
//   },
// });
