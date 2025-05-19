import { query } from "./_generated/server";

export const getCompanies = query(async (ctx) => {
  return await ctx.db.query("companies").collect();
});
