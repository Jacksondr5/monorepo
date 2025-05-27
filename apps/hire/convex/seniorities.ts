import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  SeniorityIdSchema,
  SenioritySchema,
} from "../src/server/zod/seniority";
import z from "zod";
import { query, mutation } from "./_generated/server";
import { getCompanyIdByClerkOrgId } from "./model/companies";

const seniorityQuery = zCustomQuery(query, NoOp);
const seniorityMutation = zCustomMutation(mutation, NoOp);

export const getSeniorities = seniorityQuery({
  args: z.object({ orgId: z.string() }),
  handler: async (ctx, { orgId }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const seniorities = await ctx.db
      .query("seniorities")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("asc")
      .collect();
    return z.array(SenioritySchema).parse(seniorities);
  },
  returns: z.array(SenioritySchema),
});

export const addSeniority = seniorityMutation({
  args: z.object({ orgId: z.string(), name: z.string() }),
  handler: async (ctx, { orgId, name }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const highestOrder = await ctx.db
      .query("seniorities")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("desc")
      .first()
      .then((seniority) => (seniority ? seniority.order + 1 : 0));
    await ctx.db.insert("seniorities", {
      companyId,
      name,
      order: highestOrder,
    });
  },
});

export const reorderSeniorities = seniorityMutation({
  args: z.object({ orgId: z.string(), seniorityIds: z.array(SeniorityIdSchema) }),
  handler: async (ctx, { orgId, seniorityIds }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });

    // Check that the seniorities belong to the company
    const seniorities = await ctx.db
      .query("seniorities")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .collect();
    const seniorityIdsSet = new Set(seniorities.map((s) => s._id));
    if (!seniorityIds.every((id) => seniorityIdsSet.has(id))) {
      throw new Error("Some seniorities do not belong to this company");
    }

    await Promise.all(
      seniorityIds.map((id, index) => ctx.db.patch(id, { order: index })),
    );
  },
});

export const deleteSeniority = seniorityMutation({
  args: z.object({ orgId: z.string(), _id: SeniorityIdSchema }),
  handler: async (ctx, { orgId, _id }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const seniority = await ctx.db.get(_id);
    if (!seniority) throw new Error("Seniority not found");
    if (seniority.companyId !== companyId)
      throw new Error("Seniority does not belong to this company");
    await ctx.db.delete(_id);
  },
});
