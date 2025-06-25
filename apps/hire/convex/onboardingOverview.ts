import { query } from "./_generated/server";
import { zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { z } from "zod";
import { getCompanyIdByClerkOrgId } from "./model/companies";
import { OnboardingOverviewDataSchema } from "../src/server/zod/views/onboarding-overview";

const onboardingOverviewQuery = zCustomQuery(query, NoOp);

export const getOnboardingOverviewData = onboardingOverviewQuery({
  args: { orgId: z.string() },
  async handler(ctx, args) {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: args.orgId,
    });

    if (!companyId) {
      return null;
    }

    // Get configuration to see which kanban stages should be included
    const configuration = await ctx.db
      .query("configuration")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .first();

    if (
      !configuration ||
      !configuration.onboardingOverviewKanbanStages.length
    ) {
      // No configuration or no stages configured, return empty data
      return {
        onboardingSteps: [],
        candidates: [],
      };
    }

    // Get all onboarding steps for the company
    const allOnboardingSteps = await ctx.db
      .query("onboardingSteps")
      .withIndex("by_company_order", (q) => q.eq("companyId", companyId))
      .collect();

    // Build hierarchical structure - root steps with their substeps
    const rootSteps = allOnboardingSteps
      .filter((step) => !step.parentStepId)
      .map((rootStep) => ({
        ...rootStep,
        subSteps: allOnboardingSteps
          .filter((step) => step.parentStepId === rootStep._id)
          .sort((a, b) => a.order - b.order),
      }))
      .sort((a, b) => a.order - b.order);

    // Get candidates that are in the configured kanban stages
    const allCandidates = await ctx.db
      .query("candidates")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .collect();

    const filteredCandidates = allCandidates.filter((candidate) =>
      configuration.onboardingOverviewKanbanStages.includes(
        candidate.kanbanStageId,
      ),
    );

    return {
      onboardingSteps: rootSteps,
      candidates: filteredCandidates,
    };
  },
  returns: OnboardingOverviewDataSchema.nullable(),
});
