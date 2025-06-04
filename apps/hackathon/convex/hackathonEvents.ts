import { z } from "zod";
import { query } from "./_generated/server";
import { HackathonEventSchema } from "../src/server/zod/hackathon-event";
import { zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";

const hackathonEventQuery = zCustomQuery(query, NoOp);

export const getHackathonEvents = hackathonEventQuery({
  args: z.object({}),
  handler: async (ctx, _args) => {
    const events = await ctx.db.query("hackathonEvents").collect();
    return z.array(HackathonEventSchema).parse(events);
  },
  returns: z.array(HackathonEventSchema),
});

// TODO: Replace this with a better way of selecting the current hackathon event
export const getLatestHackathonEvent = hackathonEventQuery({
  args: z.object({}),
  handler: async (ctx, _args) => {
    const latest = await ctx.db.query("hackathonEvents").order("desc").first();
    return latest ? HackathonEventSchema.parse(latest) : null;
  },
  returns: HackathonEventSchema.nullable(),
});
