import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { baseConvexFields, nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";

export const TargetTeamIdSchema = zid("targetTeams");
export type TargetTeamId = z.infer<typeof TargetTeamIdSchema>;

export const TargetTeamSchema = z.object({
  ...baseConvexFields("targetTeams"),
  companyId: CompanyIdSchema,
  name: nonEmptyString,
  order: z.number(),
});
export type TargetTeam = z.infer<typeof TargetTeamSchema>;

export const CreateTargetTeamSchema = z.object({
  name: nonEmptyString,
});
export type CreateTargetTeam = z.infer<typeof CreateTargetTeamSchema>;

export const UpdateTargetTeamSchema = TargetTeamSchema.pick({
  _id: true,
  name: true,
});
export type UpdateTargetTeam = z.infer<typeof UpdateTargetTeamSchema>;
