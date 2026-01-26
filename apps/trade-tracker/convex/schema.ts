import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  trades: defineTable({
    assetType: v.union(v.literal("crypto"), v.literal("stock")),
    campaignId: v.optional(v.id("campaigns")),
    date: v.number(),
    direction: v.union(v.literal("long"), v.literal("short")),
    notes: v.optional(v.string()),
    price: v.number(),
    quantity: v.number(),
    side: v.union(v.literal("buy"), v.literal("sell")),
    ticker: v.string(),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_date", ["date"])
    .index("by_ticker", ["ticker"]),
});
