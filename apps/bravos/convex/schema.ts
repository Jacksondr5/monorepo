import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    isBlocked: v.boolean(),
    isDone: v.boolean(),
    isImportant: v.optional(v.boolean()),
    isUrgent: v.optional(v.boolean()),
    createdById: v.string(), // Clerk user ID
    updatedAt: v.number(), // timestamp
  })
    .index("by_created_by", ["createdById"])
    .index("by_created_by_and_done", ["createdById", "isDone"])
    .index("by_created_by_and_blocked", ["createdById", "isBlocked"]),
});
