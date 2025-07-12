import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { baseConvexFieldsOmit, nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";
import { baseConvexFields } from "./utils";
import { TargetTeamIdSchema } from "./targetTeam";

export const CandidateIdSchema = zid("candidates");

export const CandidateSchema = z.object({
  ...baseConvexFields("candidates"),
  companyId: CompanyIdSchema,
  completedOnboardingSteps: z.array(zid("onboardingSteps")).default([]),
  email: z.email().optional(),
  kanbanStageId: zid("kanbanStages"),
  linkedinProfile: z.url().optional(),
  name: nonEmptyString,
  location: z.string().optional(),
  startDate: z.number().optional(),
  nextSteps: z.string().optional(),
  phone: z.string().optional(),
  resumeUrl: z.url().optional(),
  roleId: zid("roles").optional(),
  salaryExpectations: z.string().optional(),
  seniorityId: zid("seniorities").optional(),
  sourceId: zid("sources").optional(),
  targetTeamId: TargetTeamIdSchema.optional(),
  type: z.enum(["employee", "contractor"]).optional(),
  updatedAt: z.number(),
});

export const CreateCandidateSchema = CandidateSchema.omit({
  ...baseConvexFieldsOmit,
  companyId: true,
  completedOnboardingSteps: true,
  updatedAt: true,
});

export const UpdateCandidateSchema = CandidateSchema.omit({
  _creationTime: true,
  companyId: true,
  completedOnboardingSteps: true,
  updatedAt: true,
});

export const UpdateCandidateStageSchema = z.object({
  candidateId: CandidateIdSchema,
  kanbanStageId: zid("kanbanStages"),
});

export type CandidateId = z.infer<typeof CandidateIdSchema>;
export type ZodCandidate = z.infer<typeof CandidateSchema>;
export type ZodCreateCandidate = z.infer<typeof CreateCandidateSchema>;
export type ZodUpdateCandidate = z.infer<typeof UpdateCandidateSchema>;
