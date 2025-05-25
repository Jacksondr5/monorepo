import { mutation, query } from "./_generated/server";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  KanbanStageIdSchema,
  KanbanStageSchema,
} from "../src/server/zod/kanbanStage";
import z from "zod";
import { getCompanyIdByClerkOrgId } from "./model/companies";

const kanbanStageQuery = zCustomQuery(query, NoOp);
const kanbanStageMutation = zCustomMutation(mutation, NoOp);

// --- Get Kanban Stages ---
export const getKanbanStages = kanbanStageQuery({
  args: z.object({ orgId: z.string() }),
  handler: async (ctx, { orgId }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const stages = await ctx.db
      .query("kanbanStages")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("asc")
      .collect();
    return z.array(KanbanStageSchema).parse(stages);
  },
  returns: z.array(KanbanStageSchema),
});

// --- Add Kanban Stage ---
export const addKanbanStage = kanbanStageMutation({
  args: z.object({ orgId: z.string(), name: z.string() }),
  handler: async (ctx, { orgId, name }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const highestOrder = await ctx.db
      .query("kanbanStages")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .order("desc")
      .first()
      .then((stage) => (stage ? stage.order + 1 : 0));
    await ctx.db.insert("kanbanStages", {
      companyId,
      name,
      order: highestOrder,
    });
  },
});

// --- Reorder Kanban Stages ---
export const reorderKanbanStages = kanbanStageMutation({
  args: z.object({ stageIds: z.array(KanbanStageIdSchema) }),
  handler: async (ctx, { stageIds }) => {
    await Promise.all(
      stageIds.map((id, index) => ctx.db.patch(id, { order: index })),
    );
  },
});

// --- Delete Kanban Stage ---
export const deleteKanbanStage = kanbanStageMutation({
  args: z.object({ orgId: z.string(), _id: KanbanStageIdSchema }),
  handler: async (ctx, { orgId, _id }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const stage = await ctx.db.get(_id);
    if (!stage) throw new Error("Stage not found");
    if (stage.companyId !== companyId)
      throw new Error("Stage does not belong to this company");
    await ctx.db.delete(_id);
  },
});
