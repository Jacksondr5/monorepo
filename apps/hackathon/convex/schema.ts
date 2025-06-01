import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  hackathonEvents: defineTable({
    currentPhase: v.union(
      v.literal("PROJECT_SUBMISSION"),
      v.literal("PROJECT_VOTING"),
      v.literal("EVENT_IN_PROGRESS"),
      v.literal("EVENT_ENDED"),
    ),
    name: v.string(),
  }),
  projects: defineTable({
    creatorUserId: v.id("users"),
    description: v.string(),
    hackathonEventId: v.id("hackathonEvents"),
    title: v.string(),
    updatedAt: v.number(),
  }).index("by_hackathon_event", ["hackathonEventId"]),
  users: defineTable({
    avatarUrl: v.string(),
    clerkUserId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(v.literal("ADMIN"), v.literal("USER")),
  }).index("by_clerk_user_id", ["clerkUserId"]),
});
