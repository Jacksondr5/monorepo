// --- Zod schema for role validation ---
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";
import { baseConvexFields, baseConvexFieldsOmit } from "./utils";

export const RoleIdSchema = zid("roles");

export const RoleSchema = z.object({
  ...baseConvexFields("roles"),
  companyId: CompanyIdSchema,
  name: nonEmptyString,
  order: z.number(),
});

export const CreateRoleSchema = RoleSchema.omit(baseConvexFieldsOmit);

export type RoleId = z.infer<typeof RoleIdSchema>;
export type ZodRole = z.infer<typeof RoleSchema>;
export type ZodCreateRole = z.infer<typeof CreateRoleSchema>;
