import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { DatabaseReader } from "./_generated/server";

type Company = {
  _id: Id<"companies">;
  clerkOrganizationId: string;
  name: string;
};

async function getCompany(
  ctx: { db: DatabaseReader },
  orgId: string,
): Promise<Company> {
  const company = await ctx.db
    .query("companies")
    .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrganizationId", orgId))
    .first();
  if (!company) {
    throw new Error("Company not found");
  }
  return company;
}

export const getKanbanStages = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const company = await getCompany(ctx, orgId);
    return await ctx.db
      .query("kanbanStages")
      .withIndex("by_company_order", (q) => q.eq("companyId", company._id))
      .order("asc")
      .collect();
  },
});

export const addKanbanStage = mutation({
  args: { orgId: v.string(), name: v.string() },
  handler: async (ctx, { orgId, name }) => {
    const company = await getCompany(ctx, orgId);
    const highestOrder = await ctx.db
      .query("kanbanStages")
      .withIndex("by_company_order", (q) => q.eq("companyId", company._id))
      .order("desc")
      .first()
      .then((stage) => (stage ? stage.order + 1 : 0));

    return await ctx.db.insert("kanbanStages", {
      companyId: company._id,
      name,
      order: highestOrder,
    });
  },
});

export const reorderKanbanStages = mutation({
  args: { stageIds: v.array(v.id("kanbanStages")) },
  handler: async (ctx, { stageIds }) => {
    await Promise.all(
      stageIds.map((_id, index) => ctx.db.patch(_id, { order: index })),
    );
  },
});

export const deleteKanbanStage = mutation({
  args: { orgId: v.string(), _id: v.id("kanbanStages") },
  handler: async (ctx, { orgId, _id }) => {
    const company = await getCompany(ctx, orgId);
    const stage = await ctx.db.get(_id);
    if (!stage) {
      throw new Error("Stage not found");
    }
    if (stage.companyId !== company._id) {
      throw new Error("Stage does not belong to this company");
    }
    await ctx.db.delete(_id);
  },
});
