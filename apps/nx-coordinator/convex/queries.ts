import { v } from "convex/values";
import { query } from "./_generated/server";

export const healthCheck = query({
  args: {},
  handler: async () => {
    // Simple query that just returns a timestamp to verify database connectivity
    return { status: "ok" as const, timestamp: Date.now() };
  },
  returns: v.object({
    status: v.literal("ok"),
    timestamp: v.number(),
  }),
});
