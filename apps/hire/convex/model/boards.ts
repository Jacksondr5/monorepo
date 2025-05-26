import { CompanyId } from "../../src/server/zod/company";
import { QueryCtx } from "../_generated/server";

export const getBoardBySlug = async (
  ctx: QueryCtx,
  args: { companyId: CompanyId; slug: string },
) => {
  const board = await ctx.db
    .query("boards")
    .withIndex("by_company_slug", (q) =>
      q.eq("companyId", args.companyId).eq("slug", args.slug),
    )
    .unique();
  return board;
};
