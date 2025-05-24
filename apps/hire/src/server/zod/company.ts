// --- Zod schema for company validation ---
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { nonEmptyString } from "./utils";

export const CompanyIdSchema = zid("companies");

export const CompanySchema = z.object({
  id: CompanyIdSchema,
  clerkOrganizationId: z.string(),
  name: nonEmptyString,
});

export const CreateCompanySchema = CompanySchema.omit({
  id: true,
});

export type CompanyId = z.infer<typeof CompanyIdSchema>;
export type ZodCompany = z.infer<typeof CompanySchema>;
export type ZodCreateCompany = z.infer<typeof CreateCompanySchema>;
