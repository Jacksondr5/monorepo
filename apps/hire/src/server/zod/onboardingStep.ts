import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import {
  baseConvexFields,
  baseConvexFieldsOmit,
  nonEmptyString,
} from "./utils";
import { CompanyIdSchema } from "./company";

export const OnboardingStepIdSchema = zid("onboardingSteps");

export const OnboardingStepSchema = z.object({
  ...baseConvexFields("onboardingSteps"),
  companyId: CompanyIdSchema,
  name: nonEmptyString,
  details: z.string().optional(),
  parentStepId: OnboardingStepIdSchema.optional(),
  order: z.number(),
});

export const CreateOnboardingStepSchema = OnboardingStepSchema.omit({
  ...baseConvexFieldsOmit,
  companyId: true,
});

export const UpdateOnboardingStepSchema = OnboardingStepSchema.omit({
  _creationTime: true,
  companyId: true,
});

export const AddStepArgsSchema = z.object({
  orgId: z.string(),
  name: nonEmptyString,
  details: z.string().optional(),
  parentStepId: OnboardingStepIdSchema.optional(),
});

export const RemoveStepArgsSchema = z.object({
  orgId: z.string(),
  id: OnboardingStepIdSchema,
});

export const UpdateStepArgsSchema = z.object({
  orgId: z.string(),
  id: OnboardingStepIdSchema,
  updatedStep: UpdateOnboardingStepSchema,
});

export type OnboardingStepId = z.infer<typeof OnboardingStepIdSchema>;
export type ZodOnboardingStep = z.infer<typeof OnboardingStepSchema>;
export type ZodCreateOnboardingStep = z.infer<
  typeof CreateOnboardingStepSchema
>;
export type ZodUpdateOnboardingStep = z.infer<
  typeof UpdateOnboardingStepSchema
>;
export type ZodAddStepArgs = z.infer<typeof AddStepArgsSchema>;
export type ZodRemoveStepArgs = z.infer<typeof RemoveStepArgsSchema>;
export type ZodUpdateStepArgs = z.infer<typeof UpdateStepArgsSchema>;
