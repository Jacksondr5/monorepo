// --- Sources Convex handlers using Zod schemas ---
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { SourceIdSchema, SourceSchema } from "../src/server/zod/source";
import z from "zod";
import { query, mutation } from "./_generated/server";
import { getCompanyIdByClerkOrgId } from "./model/companies";

const sourceQuery = zCustomQuery(query, NoOp);
const sourceMutation = zCustomMutation(mutation, NoOp);

// --- Get Sources ---
export const getSources = sourceQuery({
  args: z.object({ orgId: z.string() }),
  handler: async (ctx, { orgId }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const sources = await ctx.db
      .query("sources")
      .withIndex("by_company_order", (q: any) => q.eq("companyId", companyId))
      .order("asc")
      .collect();
    return z.array(SourceSchema).parse(sources);
  },
  returns: z.array(SourceSchema),
});

// --- Add Source ---
export const addSource = sourceMutation({
  args: z.object({ orgId: z.string(), name: z.string() }),
  handler: async (ctx, { orgId, name }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const highestOrder = await ctx.db
      .query("sources")
      .withIndex("by_company_order", (q: any) => q.eq("companyId", companyId))
      .order("desc")
      .first()
      .then((source: any) => (source ? source.order + 1 : 0));
    await ctx.db.insert("sources", {
      companyId,
      name,
      order: highestOrder,
    });
  },
});

// --- Reorder Sources ---
export const reorderSources = sourceMutation({
  args: z.object({ sourceIds: z.array(SourceIdSchema) }),
  handler: async (ctx, { sourceIds }) => {
    await Promise.all(
      sourceIds.map((id, index) => ctx.db.patch(id, { order: index })),
    );
  },
});

// --- Delete Source ---
export const deleteSource = sourceMutation({
  args: z.object({ orgId: z.string(), id: SourceIdSchema }),
  handler: async (ctx, { orgId, id }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const source = await ctx.db.get(id);
    if (!source) throw new Error("Source not found");
    if (source.companyId !== companyId)
      throw new Error("Source does not belong to this company");
    await ctx.db.delete(id);
  },
});
