import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  CandidateIdSchema,
  CandidateSchema,
  CreateCandidateSchema,
  UpdateCandidateSchema,
} from "../src/server/zod/candidate";
import { CompanyIdSchema } from "../src/server/zod/company";
import z from "zod";

const candidateQuery = zCustomQuery(query, NoOp);
const candidateMutation = zCustomMutation(mutation, NoOp);

// --- Create Candidate ---
export const createCandidate = candidateMutation({
  args: CreateCandidateSchema,
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("candidates", {
      companyId: args.companyId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      linkedinProfile: args.linkedinProfile,
      resumeUrl: args.resumeUrl,
      targetTeam: args.targetTeam,
      roleId: args.roleId,
      seniorityId: args.seniorityId,
      kanbanStageId: args.kanbanStageId,
      salaryExpectations: args.salaryExpectations,
      nextSteps: args.nextSteps,
      sourceId: args.sourceId,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// --- Get Candidate by ID ---
export const getCandidate = candidateQuery({
  args: { id: CandidateIdSchema },
  handler: async (ctx, { id }) => {
    const candidate = await ctx.db.get(id);
    if (!candidate) {
      throw new Error("Candidate not found");
    }
    return CandidateSchema.parse(candidate);
  },
  returns: CandidateSchema,
});

// --- List Candidates by Company ---
export const listCandidates = candidateQuery({
  args: { companyId: CompanyIdSchema },
  handler: async (ctx, { companyId }) => {
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
    const candidate = await ctx.db.get(args.id);
    if (!candidate) {
      throw new Error("Candidate not found");
    }
    const patch = {
      ...args,
      updatedAt: Date.now(),
    };
    await ctx.db.patch(args.id, patch);
    return CandidateSchema.parse(await ctx.db.get(args.id));
  },
  returns: CandidateSchema,
});

// --- Delete Candidate ---
export const deleteCandidate = candidateMutation({
  args: { id: CandidateIdSchema },
  handler: async (ctx, { id }) => {
    const candidate = await ctx.db.get(id);
    if (!candidate) {
      throw new Error("Candidate not found");
    }
    await ctx.db.delete(id);
    return true;
  },
});
