import { mutation, query } from "./_generated/server";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  CandidateIdSchema,
  CandidateSchema,
  CreateCandidateSchema,
  UpdateCandidateSchema,
  UpdateCandidateStageSchema,
} from "../src/server/zod/candidate";
import { getCandidateById, verifyCandidateExists } from "./model/candidates";
import { getCompanyIdByClerkOrgId } from "./model/companies";

const candidateQuery = zCustomQuery(query, NoOp);
const candidateMutation = zCustomMutation(mutation, NoOp);

export const createCandidate = candidateMutation({
  args: CreateCandidateSchema,
  handler: async (ctx, { organizationId, ...args }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: organizationId,
    });
    await ctx.db.insert("candidates", {
      ...args,
      companyId,
      updatedAt: Date.now(),
    });
  },
});

export const getCandidate = candidateQuery({
  args: { _id: CandidateIdSchema },
  handler: async (ctx, { _id }) => {
    const candidate = await getCandidateById(ctx, { _id });
    return CandidateSchema.parse(candidate);
  },
  returns: CandidateSchema,
});

export const updateCandidate = candidateMutation({
  args: UpdateCandidateSchema,
  handler: async (ctx, args) => {
    await verifyCandidateExists(ctx, { _id: args._id });
    const patch = {
      ...args,
      updatedAt: Date.now(),
    };
    await ctx.db.patch(args._id, patch);
  },
});

export const deleteCandidate = candidateMutation({
  args: { _id: CandidateIdSchema },
  handler: async (ctx, { _id }) => {
    await verifyCandidateExists(ctx, { _id });
    await ctx.db.delete(_id);
  },
});

export const updateCandidateStage = candidateMutation({
  args: UpdateCandidateStageSchema,
  handler: async (ctx, args) => {
    await verifyCandidateExists(ctx, { _id: args.candidateId });
    await ctx.db.patch(args.candidateId, {
      kanbanStageId: args.kanbanStageId,
      updatedAt: Date.now(),
    });
  },
});
