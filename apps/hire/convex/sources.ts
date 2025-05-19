import { AnyDataModel, GenericQueryCtx } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const getCompany = async (
  ctx: GenericQueryCtx<AnyDataModel>,
  orgId: string,
) => {
  return ctx.db
    .query("companies")
    .filter((q) => q.eq(q.field("clerkOrganizationId"), orgId))
    .first();
};

export const getSources = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, { orgId }) => {
    const company = await getCompany(ctx, orgId);
    return (
      await ctx.db
        .query("sources")
        .filter((q) => q.eq(q.field("companyId"), company._id))
        .collect()
    ).sort((a, b) => a.order - b.order);
  },
});

export const addSource = mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { orgId, name }) => {
    const company = await getCompany(ctx, orgId);
    await ctx.db.insert("sources", {
      name,
      order: (await ctx.db.query("sources").collect()).length + 1,
      companyId: company._id,
    });
  },
});

export const updateSource = mutation({
  args: {
    orgId: v.string(),
    _id: v.id("sources"),
    name: v.string(),
    order: v.number(),
  },
  handler: async (ctx, { orgId, _id, name, order }) => {
    const company = await getCompany(ctx, orgId);
    const source = await ctx.db
      .query("sources")
      .filter((q) => q.eq(q.field("_id"), _id))
      .first();
    if (source.companyId !== company._id) {
      throw new Error("Source does not belong to this company");
    }
    await ctx.db.patch(_id, {
      name,
      order,
    });
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
    if (source.companyId !== company._id) {
      throw new Error("Source does not belong to this company");
    }
    await ctx.db.delete(_id);
  },
});
