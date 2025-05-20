import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
  candidates: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    linkedinProfile: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
    targetTeam: v.optional(v.string()),
    roleId: v.id("roles"),
    seniorityId: v.id("seniorities"),
    kanbanStageId: v.id("kanbanStages"),
    salaryExpectations: v.optional(v.string()),
    nextSteps: v.optional(v.string()),
    sourceId: v.optional(v.id("sources")),
    updatedAt: v.optional(v.number()), // store as timestamp (Date.now())
  })
    .index("by_company", ["companyId"])
    .index("by_role", ["roleId"]),
});
