import { z } from "zod";
import { CandidateSchema } from "../candidate";
import { OnboardingStepSchema } from "../onboardingStep";

const OnboardingStepWithSubStepsSchema = OnboardingStepSchema.extend({
  subSteps: z.array(OnboardingStepSchema),
});

export const OnboardingOverviewDataSchema = z.object({
  onboardingSteps: z.array(OnboardingStepWithSubStepsSchema),
  candidates: z.array(CandidateSchema),
});

export type ZodOnboardingOverviewData = z.infer<
  typeof OnboardingOverviewDataSchema
>;
