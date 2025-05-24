import { query } from "./_generated/server";
import { zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { CompanySchema } from "../src/server/zod/company";
import z from "zod";

const companyQuery = zCustomQuery(query, NoOp);

export const getCompanies = companyQuery({
  handler: async (ctx) => {
    const companies = await ctx.db.query("companies").collect();
    return z.array(CompanySchema).parse(companies);
  },
  returns: z.array(CompanySchema),
});
