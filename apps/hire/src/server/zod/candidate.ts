// --- Zod schema for validation ---
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
  email: z.string().email({ message: "Invalid email address" }).optional(),
  kanbanStageId: zid("kanbanStages"),
  linkedinProfile: z.string().url({ message: "Invalid URL" }).optional(),
  name: nonEmptyString,
  location: z.string().optional(),
  startDate: z.number().optional(), // milliseconds from UTC start
  nextSteps: z.string().optional(),
  phone: z.string().optional(),
  resumeUrl: z.string().url({ message: "Invalid URL" }).optional(),
  roleId: zid("roles").optional(),
  salaryExpectations: z.string().optional(),
  seniorityId: zid("seniorities").optional(),
  sourceId: zid("sources").optional(),
  targetTeamId: TargetTeamIdSchema.optional(),
  updatedAt: z.number(),
});

export const CreateCandidateSchema = CandidateSchema.omit({
  ...baseConvexFieldsOmit,
  companyId: true,
  updatedAt: true,
});

export const UpdateCandidateSchema = CandidateSchema.omit({
  _creationTime: true,
  companyId: true,
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
