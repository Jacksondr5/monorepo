import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  finalizedProjects: defineTable({
    comments: v.array(
      v.object({
        authorId: v.id("users"),
        createdAt: v.number(),
        id: v.string(), // Unique ID for each comment, generated on creation
        text: v.string(),
        upvotes: v.array(
          // Upvotes for this specific comment
          v.object({
            createdAt: v.number(),
            userId: v.id("users"),
          }),
        ),
      }),
    ),
    description: v.string(),
    hackathonEventId: v.id("hackathonEvents"),
    interestedUsers: v.array(
      v.object({
        createdAt: v.number(),
        userId: v.id("users"),
      }),
    ),
    assignedUsers: v.optional(
      v.array(
        v.object({
          createdAt: v.number(),
          userId: v.id("users"),
        }),
      ),
    ),
    title: v.string(),
    updatedAt: v.number(),
  }).index("by_hackathon_event", ["hackathonEventId"]),
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
    comments: v.optional(
      v.array(
        v.object({
          authorId: v.id("users"),
          createdAt: v.number(),
          id: v.string(), // Unique ID for each comment, generated on creation
          text: v.string(),
          upvotes: v.array(
            // Upvotes for this specific comment
            v.object({
              createdAt: v.number(),
              userId: v.id("users"),
            }),
          ),
        }),
      ),
    ),
    creatorUserId: v.id("users"),
    description: v.string(),
    hackathonEventId: v.id("hackathonEvents"),
    title: v.string(),
    updatedAt: v.number(),
    upvotes: v.optional(
      v.array(
        // Upvotes for the project itself
        v.object({
          createdAt: v.number(),
          userId: v.id("users"),
        }),
      ),
    ),
  }).index("by_hackathon_event", ["hackathonEventId"]),
  users: defineTable({
    avatarUrl: v.string(),
    clerkUserId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(v.literal("ADMIN"), v.literal("USER")),
  }).index("by_clerk_user_id", ["clerkUserId"]),
});
