import { QueryCtx } from "../_generated/server";
import { CandidateId } from "../../src/server/zod/candidate";

export const getCandidateById = async (
  ctx: QueryCtx,
  args: { id: CandidateId },
) => {
  const candidate = await ctx.db.get(args.id);
  if (!candidate) throw new Error("Candidate not found");
  return candidate;
};

export const verifyCandidateExists = async (
  ctx: QueryCtx,
  args: { id: CandidateId },
) => {
  await getCandidateById(ctx, args);
};
