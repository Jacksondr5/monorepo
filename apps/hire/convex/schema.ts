import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  companies: defineTable({
    clerkOrganizationId: v.string(),
    name: v.string(),
  }),

  sources: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    order: v.float64(),
  }),
});
