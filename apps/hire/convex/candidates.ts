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
import z from "zod";
import { getCandidateById, verifyCandidateExists } from "./model/candidates";
import { getCompanyIdByClerkOrgId } from "./model/companies";

const candidateQuery = zCustomQuery(query, NoOp);
const candidateMutation = zCustomMutation(mutation, NoOp);

// --- Create Candidate ---
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

// --- Get Candidate by ID ---
export const getCandidate = candidateQuery({
  args: { _id: CandidateIdSchema },
  handler: async (ctx, { _id }) => {
    const candidate = await getCandidateById(ctx, { _id });
    return CandidateSchema.parse(candidate);
  },
  returns: CandidateSchema,
});

// --- List Candidates by Company ---
export const listCandidates = candidateQuery({
  args: { orgId: z.string() },
  handler: async (ctx, { orgId }) => {
    const companyId = await getCompanyIdByClerkOrgId(ctx, {
      clerkOrgId: orgId,
    });
    const candidates = await ctx.db
      .query("candidates")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .collect();
    return candidates.map((candidate) => CandidateSchema.parse(candidate));
  },
  returns: z.array(CandidateSchema),
});

// --- Update Candidate ---
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

// --- Delete Candidate ---
export const deleteCandidate = candidateMutation({
  args: { _id: CandidateIdSchema },
  handler: async (ctx, { _id }) => {
    await verifyCandidateExists(ctx, { _id });
    await ctx.db.delete(_id);
  },
});

// Mutation to update a candidate's Kanban stage
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
