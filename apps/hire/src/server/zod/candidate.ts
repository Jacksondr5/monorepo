// --- Zod schema for validation ---
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { baseConvexFieldsOmit, nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";
import { baseConvexFields } from "./utils";

export const CandidateIdSchema = zid("candidates");

export const CandidateSchema = z.object({
  ...baseConvexFields("candidates"),
  companyId: CompanyIdSchema,
  email: z.string().email({ message: "Invalid email address" }).optional(),
  kanbanStageId: zid("kanbanStages"),
  linkedinProfile: z.string().url({ message: "Invalid URL" }).optional(),
  name: nonEmptyString,
  nextSteps: z.string().optional(),
  phone: z.string().optional(),
  resumeUrl: z.string().url({ message: "Invalid URL" }).optional(),
  roleId: zid("roles").optional(),
  salaryExpectations: z.string().optional(),
  seniorityId: zid("seniorities").optional(),
  sourceId: zid("sources").optional(),
  targetTeam: z.string().optional(),
  updatedAt: z.number(),
});

export const CreateCandidateSchema = CandidateSchema.omit({
  ...baseConvexFieldsOmit,
  companyId: true,
  updatedAt: true,
}).extend({ organizationId: z.string() });

export const UpdateCandidateSchema = CandidateSchema.omit({
  _creationTime: true,
});

export type CandidateId = z.infer<typeof CandidateIdSchema>;
export type ZodCandidate = z.infer<typeof CandidateSchema>;
export type ZodCreateCandidate = z.infer<typeof CreateCandidateSchema>;
export type ZodUpdateCandidate = z.infer<typeof UpdateCandidateSchema>;
