// --- Zod schema for seniority validation ---
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";

export const SeniorityIdSchema = zid("seniorities");

export const SenioritySchema = z.object({
  id: SeniorityIdSchema,
  companyId: CompanyIdSchema,
  name: nonEmptyString,
  order: z.number(),
});

export const CreateSenioritySchema = SenioritySchema.omit({
  id: true,
});

export const UpdateSenioritySchema = SenioritySchema.omit({
  id: true,
});

export type SeniorityId = z.infer<typeof SeniorityIdSchema>;
export type ZodSeniority = z.infer<typeof SenioritySchema>;
export type ZodCreateSeniority = z.infer<typeof CreateSenioritySchema>;
export type ZodUpdateSeniority = z.infer<typeof UpdateSenioritySchema>;
