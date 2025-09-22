import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  videoPosts: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(), // timestamp
    videoUrl: v.string(),
  }),
});
