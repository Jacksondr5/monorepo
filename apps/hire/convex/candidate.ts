import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { z } from "zod";

// --- Zod schema for validation ---
const nonEmptyString = z.string().min(1);
export const CandidateSchema = z.object({
  companyId: z.string().uuid(),
  name: nonEmptyString,
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phone: z.string().optional(),
  linkedinProfile: z.string().url({ message: "Invalid URL" }).optional(),
  resumeUrl: z.string().url({ message: "Invalid URL" }).optional(),
  targetTeam: z.string().optional(),
  roleId: z.string().uuid(),
  seniorityId: z.string().uuid(),
  kanbanStageId: z.string().uuid(),
  salaryExpectations: z.string().optional(),
  nextSteps: z.string().optional(),
  sourceId: z.string().uuid().optional(),
  updatedAt: z.date().optional(),
});

// --- Create Candidate ---
export const createCandidate = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    linkedinProfile: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    targetTeam: v.optional(v.string()),
    roleId: v.id("roles"),
    seniorityId: v.id("seniorities"),
    kanbanStageId: v.id("kanbanStages"),
    salaryExpectations: v.optional(v.string()),
    nextSteps: v.optional(v.string()),
    sourceId: v.optional(v.id("sources")),
  },
  handler: async (ctx, args) => {
    // Optionally validate with Zod here
    // const parsed = CandidateSchema.parse({ ...args, updatedAt: Date.now() });
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
export const getCandidate = query({
  args: { _id: v.id("candidates") },
  handler: async (ctx, { _id }) => {
    return await ctx.db.get(_id);
  },
});

// --- List Candidates by Company ---
export const listCandidates = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, { companyId }) => {
    return await ctx.db
      .query("candidates")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .collect();
  },
});

// --- Update Candidate ---
export const updateCandidate = mutation({
  args: {
    _id: v.id("candidates"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    linkedinProfile: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    targetTeam: v.optional(v.string()),
    roleId: v.optional(v.id("roles")),
    seniorityId: v.optional(v.id("seniorities")),
    kanbanStageId: v.optional(v.id("kanbanStages")),
    salaryExpectations: v.optional(v.string()),
    nextSteps: v.optional(v.string()),
    sourceId: v.optional(v.id("sources")),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, { _id, ...patch }) => {
    patch.updatedAt = Date.now();
    await ctx.db.patch(_id, patch);
    return await ctx.db.get(_id);
  },
});

// --- Delete Candidate ---
export const deleteCandidate = mutation({
  args: { _id: v.id("candidates") },
  handler: async (ctx, { _id }) => {
    await ctx.db.delete(_id);
    return true;
  },
});
