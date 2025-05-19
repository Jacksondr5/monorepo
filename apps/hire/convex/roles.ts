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

export const getRoles = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const company = await getCompany(ctx, orgId);
    return await ctx.db
      .query("roles")
      .withIndex("by_company_order", (q: any) => q.eq("companyId", company._id))
      .order("asc")
      .collect();
  },
});

export const addRole = mutation({
  args: { orgId: v.string(), name: v.string() },
  handler: async (ctx, { orgId, name }) => {
    const company = await getCompany(ctx, orgId);
    const count = await ctx.db
      .query("roles")
      .withIndex("by_company_order", (q) => q.eq("companyId", company._id))
      .collect()
      .then((roles) => roles.length);

    return await ctx.db.insert("roles", {
      companyId: company._id,
      name,
      order: count,
    });
  },
});

export const reorderRoles = mutation({
  args: { roleIds: v.array(v.id("roles")) },
  handler: async (ctx, { roleIds }) => {
    await Promise.all(
      roleIds.map((_id, index) => ctx.db.patch(_id, { order: index })),
    );
  },
});

export const deleteRole = mutation({
  args: { orgId: v.string(), _id: v.id("roles") },
  handler: async (ctx, { orgId, _id }) => {
    const company = await getCompany(ctx, orgId);
    const role = await ctx.db.get(_id);
    if (!role) {
      throw new Error("Role not found");
    }
    if (role.companyId !== company._id) {
      throw new Error("Role does not belong to this company");
    }
    await ctx.db.delete(_id);
  },
});
