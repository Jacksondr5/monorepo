import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    companyId: v.id("companies"),
    kanbanStageIds: v.array(v.id("kanbanStages")),
    name: v.string(),
    order: v.float64(),
    slug: v.string(),
  }).index("by_company_order", ["companyId", "order"]),
  candidates: defineTable({
    companyId: v.id("companies"),
    email: v.optional(v.string()),
    kanbanStageId: v.optional(v.id("kanbanStages")),
    linkedinProfile: v.optional(v.string()),
    name: v.string(),
    nextSteps: v.optional(v.string()),
    phone: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    roleId: v.optional(v.id("roles")),
    salaryExpectations: v.optional(v.string()),
    seniorityId: v.optional(v.id("seniorities")),
    sourceId: v.optional(v.id("sources")),
    targetTeam: v.optional(v.string()),
    updatedAt: v.number(), // store as timestamp (Date.now())
  })
    .index("by_company", ["companyId"])
    .index("by_role", ["roleId"]),
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
});
