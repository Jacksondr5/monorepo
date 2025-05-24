import { mutation, query } from "./_generated/server";
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
import { getCandidateById, verifyCandidateExists } from "./model/candidates";

const candidateQuery = zCustomQuery(query, NoOp);
const candidateMutation = zCustomMutation(mutation, NoOp);

// --- Create Candidate ---
export const createCandidate = candidateMutation({
  args: CreateCandidateSchema,
  handler: async (ctx, args) => {
    await ctx.db.insert("candidates", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// --- Get Candidate by ID ---
export const getCandidate = candidateQuery({
  args: { id: CandidateIdSchema },
  handler: async (ctx, { id }) => {
    const candidate = await getCandidateById(ctx, { id });
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
    await verifyCandidateExists(ctx, { id: args.id });
    const patch = {
      ...args,
      updatedAt: Date.now(),
    };
    await ctx.db.patch(args.id, patch);
  },
});

// --- Delete Candidate ---
export const deleteCandidate = candidateMutation({
  args: { id: CandidateIdSchema },
  handler: async (ctx, { id }) => {
    await verifyCandidateExists(ctx, { id });
    await ctx.db.delete(id);
  },
});
