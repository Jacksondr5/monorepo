import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCompanyIdByClerkOrgId } from "./model/companies";

// Get configuration for a company
export const getConfiguration = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: args.orgId,
    });

    const config = await ctx.db
      .query("configuration")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .first();

    return config;
  },
});

// Update onboarding overview kanban stages
export const updateOnboardingOverviewStages = mutation({
  args: {
    orgId: v.string(),
    kanbanStageIds: v.array(v.id("kanbanStages")),
  },
  handler: async (ctx, args) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: args.orgId,
    });

    // Validate that all kanban stages belong to this company
    for (const stageId of args.kanbanStageIds) {
      const stage = await ctx.db.get(stageId);
      if (!stage || stage.companyId !== companyId) {
        throw new Error(
          `Kanban stage ${stageId} does not belong to this organization`,
        );
      }
    }

    const config = await ctx.db
      .query("configuration")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .first();

    if (!config) {
      // Create new configuration
      await ctx.db.insert("configuration", {
        companyId: companyId,
        onboardingOverviewKanbanStages: args.kanbanStageIds,
      });
    } else {
      // Update existing configuration
      await ctx.db.patch(config._id, {
        onboardingOverviewKanbanStages: args.kanbanStageIds,
      });
    }
  },
});
