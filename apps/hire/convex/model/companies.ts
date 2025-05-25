import { QueryCtx } from "../_generated/server";

export async function getCompanyIdByClerkOrgId(
  ctx: QueryCtx,
  args: { clerkOrgId: string },
) {
  const company = await ctx.db
    .query("companies")
    .withIndex("by_clerk_org_id", (q) =>
      q.eq("clerkOrganizationId", args.clerkOrgId),
    )
    .first();
  if (!company) throw new Error("Company not found");
  return company._id;
}
