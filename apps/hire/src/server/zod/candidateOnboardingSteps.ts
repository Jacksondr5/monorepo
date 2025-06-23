import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { baseConvexFields, baseConvexFieldsOmit } from "./utils";
import { CandidateIdSchema } from "./candidate";
import { OnboardingStepIdSchema } from "./onboardingStep";

export const CandidateOnboardingStepsIdSchema = zid("candidateOnboardingSteps");

export const CandidateOnboardingStepsSchema = z.object({
  ...baseConvexFields("candidateOnboardingSteps"),
  candidateId: CandidateIdSchema,
  completedSteps: z.array(OnboardingStepIdSchema),
});

export const CreateCandidateOnboardingStepsSchema =
  CandidateOnboardingStepsSchema.omit({
    ...baseConvexFieldsOmit,
  });

export const UpdateCandidateOnboardingStepsSchema =
  CandidateOnboardingStepsSchema.omit({
    _creationTime: true,
  });

export type CandidateOnboardingStepsId = z.infer<
  typeof CandidateOnboardingStepsIdSchema
>;
export type ZodCandidateOnboardingSteps = z.infer<
  typeof CandidateOnboardingStepsSchema
>;
export type ZodCreateCandidateOnboardingSteps = z.infer<
  typeof CreateCandidateOnboardingStepsSchema
>;
export type ZodUpdateCandidateOnboardingSteps = z.infer<
  typeof UpdateCandidateOnboardingStepsSchema
>;
