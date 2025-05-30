import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    companyId: v.id("companies"),
    kanbanStageIds: v.array(v.id("kanbanStages")),
    name: v.string(),
    order: v.float64(),
    slug: v.string(),
  })
    .index("by_company_order", ["companyId", "order"])
    .index("by_company_slug", ["companyId", "slug"]),
  candidates: defineTable({
    companyId: v.id("companies"),
    email: v.optional(v.string()),
    kanbanStageId: v.id("kanbanStages"),
    linkedinProfile: v.optional(v.string()),
    name: v.string(),
    nextSteps: v.optional(v.string()),
    location: v.optional(v.string()),
    startDate: v.optional(v.number()), // milliseconds from UTC start
    phone: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    roleId: v.optional(v.id("roles")),
    salaryExpectations: v.optional(v.string()),
    seniorityId: v.optional(v.id("seniorities")),
    sourceId: v.optional(v.id("sources")),
    targetTeamId: v.optional(v.id("targetTeams")),
    type: v.optional(v.union(v.literal("employee"), v.literal("contractor"))),
    updatedAt: v.number(), // store as timestamp (Date.now())
  }).index("by_company", ["companyId"]),
  companies: defineTable({
    clerkOrganizationId: v.string(),
    name: v.string(),
  }).index("by_clerk_org_id", ["clerkOrganizationId"]),
  kanbanStages: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    order: v.float64(),
  }).index("by_company_order", ["companyId", "order"]),
  roles: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    order: v.float64(),
  }).index("by_company_order", ["companyId", "order"]),
  seniorities: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    order: v.float64(),
  }).index("by_company_order", ["companyId", "order"]),
  sources: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    order: v.float64(),
  }).index("by_company_order", ["companyId", "order"]),
  targetTeams: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    order: v.float64(),
  }).index("by_company_order", ["companyId", "order"]),
});
