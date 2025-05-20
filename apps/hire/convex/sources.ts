import { GenericQueryCtx } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { DataModel } from "./_generated/dataModel";

const getCompany = async (ctx: GenericQueryCtx<DataModel>, orgId: string) => {
  const company = await ctx.db
    .query("companies")
    .filter((q) => q.eq(q.field("clerkOrganizationId"), orgId))
    .first();
  if (!company) {
    throw new Error("Company not found");
  }
  return company;
};

export const getSources = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, { orgId }) => {
    const company = await getCompany(ctx, orgId);
    const sources = (
      await ctx.db
        .query("sources")
        .withIndex("by_company_order", (q) => q.eq("companyId", company._id))
        .order("asc")
        .collect()
    ).map(({ companyId, _creationTime, ...rest }) => rest);
    return sources;
  },
});

export const addSource = mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { orgId, name }) => {
    const company = await getCompany(ctx, orgId);
    const highestOrder = await ctx.db
      .query("sources")
      .withIndex("by_company_order", (q) => q.eq("companyId", company._id))
      .order("desc")
      .first()
      .then((source) => (source ? source.order + 1 : 0));

    await ctx.db.insert("sources", {
      name,
      order: highestOrder,
      companyId: company._id,
    });
  },
});

export const reorderSources = mutation({
  args: {
    sourceIds: v.array(v.id("sources")),
  },
  handler: async (ctx, { sourceIds }) => {
    for (let i = 0; i < sourceIds.length; i++) {
      await ctx.db.patch(sourceIds[i], {
        order: i,
      });
    }
  },
});

export const deleteSource = mutation({
  args: {
    orgId: v.string(),
    _id: v.id("sources"),
  },
  handler: async (ctx, { orgId, _id }) => {
    const company = await getCompany(ctx, orgId);
    const source = await ctx.db
      .query("sources")
      .filter((q) => q.eq(q.field("_id"), _id))
      .first();
    if (!source) {
      throw new Error("Source not found");
    }
    if (source.companyId !== company._id) {
      throw new Error("Source does not belong to this company");
    }
    await ctx.db.delete(_id);
  },
});
