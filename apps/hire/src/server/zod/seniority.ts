// --- Zod schema for seniority validation ---
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";
import { baseConvexFields, baseConvexFieldsOmit } from "./utils";

export const SeniorityIdSchema = zid("seniorities");

export const SenioritySchema = z.object({
  ...baseConvexFields("seniorities"),
  companyId: CompanyIdSchema,
  name: nonEmptyString,
  order: z.number(),
});

export const CreateSenioritySchema = SenioritySchema.omit(baseConvexFieldsOmit);

export type SeniorityId = z.infer<typeof SeniorityIdSchema>;
export type ZodSeniority = z.infer<typeof SenioritySchema>;
export type ZodCreateSeniority = z.infer<typeof CreateSenioritySchema>;
