import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  TargetTeamIdSchema,
  TargetTeamSchema,
} from "../src/server/zod/targetTeam";
import z from "zod";
import { query, mutation } from "./_generated/server";
import { getCompanyIdByClerkOrgId } from "./model/companies";

const targetTeamQuery = zCustomQuery(query, NoOp);
const targetTeamMutation = zCustomMutation(mutation, NoOp);

export const getTargetTeams = targetTeamQuery({
  args: z.object({ orgId: z.string() }),
  handler: async (ctx, { orgId }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const targetTeams = await ctx.db
      .query("targetTeams")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("asc")
      .collect();
    return z.array(TargetTeamSchema).parse(targetTeams);
  },
  returns: z.array(TargetTeamSchema),
});

export const addTargetTeam = targetTeamMutation({
  args: z.object({ orgId: z.string(), name: z.string() }),
  handler: async (ctx, { orgId, name }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const highestOrder = await ctx.db
      .query("targetTeams")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("desc")
      .first()
      .then((team) => (team ? team.order + 1 : 0));
    await ctx.db.insert("targetTeams", {
      companyId,
      name,
      order: highestOrder,
    });
  },
});

export const reorderTargetTeams = targetTeamMutation({
  args: z.object({
    orgId: z.string(),
    targetTeamIds: z.array(TargetTeamIdSchema),
  }),
  handler: async (ctx, { orgId, targetTeamIds }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    // Check that the target teams belong to the company
    const targetTeams = await ctx.db
      .query("targetTeams")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .collect();
    const targetTeamIdsSet = new Set(targetTeams.map((t) => t._id));
    if (!targetTeamIds.every((id) => targetTeamIdsSet.has(id))) {
      throw new Error("One or more target teams do not belong to this company");
    }
    await Promise.all(
      targetTeamIds.map((id, index) => ctx.db.patch(id, { order: index })),
    );
  },
});

export const deleteTargetTeam = targetTeamMutation({
  args: z.object({ orgId: z.string(), _id: TargetTeamIdSchema }),
  handler: async (ctx, { orgId, _id }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const targetTeam = await ctx.db.get(_id);
    if (!targetTeam) throw new Error("Target Team not found");
    if (targetTeam.companyId !== companyId)
      throw new Error("Target Team does not belong to this company");
    await ctx.db.delete(_id);
  },
});
