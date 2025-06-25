import { QueryCtx } from "../_generated/server";
import { CandidateId } from "../../src/server/zod/candidate";

export const getCandidateById = async (
  ctx: QueryCtx,
  args: { _id: CandidateId },
) => {
  const candidate = await ctx.db.get(args._id);
  if (!candidate) throw new Error("Candidate not found");

  // Ensure completedOnboardingSteps is always an array
  return {
    ...candidate,
    completedOnboardingSteps: candidate.completedOnboardingSteps || [],
  };
};

export const verifyCandidateExists = async (
  ctx: QueryCtx,
  args: { _id: CandidateId },
) => {
  return await getCandidateById(ctx, args);
};
