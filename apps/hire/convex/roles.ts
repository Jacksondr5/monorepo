import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { RoleIdSchema, RoleSchema } from "../src/server/zod/role";
import z from "zod";
import { query, mutation } from "./_generated/server";
import { getCompanyIdByClerkOrgId } from "./model/companies";

const roleQuery = zCustomQuery(query, NoOp);
const roleMutation = zCustomMutation(mutation, NoOp);

// --- Get Roles ---
export const getRoles = roleQuery({
  args: z.object({ orgId: z.string() }),
  handler: async (ctx, { orgId }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const roles = await ctx.db
      .query("roles")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("asc")
      .collect();
    return z.array(RoleSchema).parse(roles);
  },
  returns: z.array(RoleSchema),
});

// --- Add Role ---
export const addRole = roleMutation({
  args: z.object({ orgId: z.string(), name: z.string() }),
  handler: async (ctx, { orgId, name }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const highestOrder = await ctx.db
      .query("roles")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("desc")
      .first()
      .then((role) => (role ? role.order + 1 : 0));
    await ctx.db.insert("roles", {
      companyId,
      name,
      order: highestOrder,
    });
  },
});

// --- Reorder Roles ---
export const reorderRoles = roleMutation({
  args: z.object({ roleIds: z.array(RoleIdSchema) }),
  handler: async (ctx, { roleIds }) => {
    await Promise.all(
      roleIds.map((id, index) => ctx.db.patch(id, { order: index })),
    );
  },
});

// --- Delete Role ---
export const deleteRole = roleMutation({
  args: z.object({ orgId: z.string(), _id: RoleIdSchema }),
  handler: async (ctx, { orgId, _id }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const role = await ctx.db.get(_id);
    if (!role) throw new Error("Role not found");
    if (role.companyId !== companyId)
      throw new Error("Role does not belong to this company");
    await ctx.db.delete(_id);
  },
});
