import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { DatabaseReader } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

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

export const getSeniorities = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const company = await getCompany(ctx, orgId);
    return await ctx.db
      .query("seniorities")
      .withIndex("by_company_order", (q) => q.eq("companyId", company._id))
      .order("asc")
      .collect();
  },
});

export const addSeniority = mutation({
  args: { orgId: v.string(), name: v.string() },
  handler: async (ctx, { orgId, name }) => {
    const company = await getCompany(ctx, orgId);
    const highestOrder = await ctx.db
      .query("seniorities")
      .withIndex("by_company_order", (q) => q.eq("companyId", company._id))
      .order("desc")
      .first()
      .then((seniority) => (seniority ? seniority.order + 1 : 0));

    return await ctx.db.insert("seniorities", {
      companyId: company._id,
      name,
      order: highestOrder,
    });
  },
});

export const reorderSeniorities = mutation({
  args: { seniorityIds: v.array(v.id("seniorities")) },
  handler: async (ctx, { seniorityIds }) => {
    await Promise.all(
      seniorityIds.map((_id, index) => ctx.db.patch(_id, { order: index })),
    );
  },
});

export const deleteSeniority = mutation({
  args: { orgId: v.string(), _id: v.id("seniorities") },
  handler: async (ctx, { orgId, _id }) => {
    const company = await getCompany(ctx, orgId);
    const seniority = await ctx.db.get(_id);
    if (!seniority) {
      throw new Error("Seniority not found");
    }
    if (seniority.companyId !== company._id) {
      throw new Error("Seniority does not belong to this company");
    }
    await ctx.db.delete(_id);
  },
});
