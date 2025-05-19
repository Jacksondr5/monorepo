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
});
