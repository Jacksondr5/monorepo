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
import { z } from "zod";

const candidateQuery = zCustomQuery(query, NoOp);
const candidateMutation = zCustomMutation(mutation, NoOp);

export const createCandidate = candidateMutation({
  args: { orgId: z.string(), newCandidate: CreateCandidateSchema },
  handler: async (ctx, { orgId, newCandidate }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    await ctx.db.insert("candidates", {
      ...newCandidate,
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
  args: {orgId: z.string(), updateCandidate: UpdateCandidateSchema},
  handler: async (ctx, {orgId, updateCandidate}) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const existingCandidate = await verifyCandidateExists(ctx, { _id: updateCandidate._id });
    if (existingCandidate.companyId !== companyId) {
      throw new Error("Candidate does not belong to this organization");
    }
    const patch = {
      ...updateCandidate,
      companyId,
      updatedAt: Date.now(),
    };
    await ctx.db.patch(updateCandidate._id, patch);
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
