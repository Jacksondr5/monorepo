import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  claimAttempts: defineTable({
    agentId: v.string(),
    attemptedAt: v.number(),
    gitSha: v.string(),
    project: v.string(),
    task: v.string(),
    taskKey: v.string(),
    wasGranted: v.boolean(),
  })
    .index("by_attemptedAt", ["attemptedAt"])
    .index("by_gitSha", ["gitSha"])
    .index("by_project", ["project"])
    .index("by_task", ["task"])
    .index("by_taskKey", ["taskKey"])
    .index("by_taskKey_and_wasGranted", ["taskKey", "wasGranted"])
    .index("by_wasGranted", ["wasGranted"]),
});
