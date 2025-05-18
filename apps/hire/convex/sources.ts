import { query } from "./_generated/server";

export const getSources = query(async (ctx) => {
  return (await ctx.db.query("sources").collect()).sort(
    (a, b) => a.order - b.order,
  );
});
