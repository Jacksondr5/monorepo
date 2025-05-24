// --- Zod schema for role validation ---
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";

export const RoleIdSchema = zid("roles");

export const RoleSchema = z.object({
  id: RoleIdSchema,
  companyId: CompanyIdSchema,
  name: nonEmptyString,
  order: z.number(),
});

export const CreateRoleSchema = RoleSchema.omit({
  id: true,
});

export const UpdateRoleSchema = RoleSchema.omit({
  id: true,
});

export type RoleId = z.infer<typeof RoleIdSchema>;
export type ZodRole = z.infer<typeof RoleSchema>;
export type ZodCreateRole = z.infer<typeof CreateRoleSchema>;
export type ZodUpdateRole = z.infer<typeof UpdateRoleSchema>;
