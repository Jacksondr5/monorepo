import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Valid side/direction combinations:
// - buy + long: Opening a long position
// - sell + long: Closing a long position
// - sell + short: Opening a short position (selling to open)
// - buy + short: Closing a short position (buying to cover)
function validateSideDirection(
  side: "buy" | "sell",
  direction: "long" | "short"
): boolean {
  // All combinations are valid in trading:
  // buy+long = open long, sell+long = close long
  // sell+short = open short, buy+short = close short (cover)
  return true;
}

/**
 * Create a new trade record.
 */
export const createTrade = mutation({
  args: {
    assetType: v.union(v.literal("crypto"), v.literal("stock")),
    campaignId: v.optional(v.id("campaigns")),
    date: v.number(),
    direction: v.union(v.literal("long"), v.literal("short")),
    notes: v.optional(v.string()),
    price: v.number(),
    quantity: v.number(),
    side: v.union(v.literal("buy"), v.literal("sell")),
    ticker: v.string(),
  },
  returns: v.id("trades"),
  handler: async (ctx, args) => {
    const { assetType, campaignId, date, direction, notes, price, quantity, side, ticker } = args;

    // Validate side/direction combination
    if (!validateSideDirection(side, direction)) {
      throw new Error(`Invalid side/direction combination: ${side}/${direction}`);
    }

    const tradeId = await ctx.db.insert("trades", {
      assetType,
      campaignId,
      date,
      direction,
      notes,
      price,
      quantity,
      side,
      ticker,
    });

    return tradeId;
  },
});

/**
 * Update an existing trade record.
 */
export const updateTrade = mutation({
  args: {
    assetType: v.optional(v.union(v.literal("crypto"), v.literal("stock"))),
    campaignId: v.optional(v.id("campaigns")),
    date: v.optional(v.number()),
    direction: v.optional(v.union(v.literal("long"), v.literal("short"))),
    notes: v.optional(v.string()),
    price: v.optional(v.number()),
    quantity: v.optional(v.number()),
    side: v.optional(v.union(v.literal("buy"), v.literal("sell"))),
    ticker: v.optional(v.string()),
    tradeId: v.id("trades"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { tradeId, ...updates } = args;

    // Get existing trade to validate combination
    const existingTrade = await ctx.db.get(tradeId);
    if (!existingTrade) {
      throw new Error("Trade not found");
    }

    // Determine final values for side/direction
    const finalSide = updates.side ?? existingTrade.side;
    const finalDirection = updates.direction ?? existingTrade.direction;

    // Validate side/direction combination
    if (!validateSideDirection(finalSide, finalDirection)) {
      throw new Error(`Invalid side/direction combination: ${finalSide}/${finalDirection}`);
    }

    // Build patch object with only defined values
    const patch: Record<string, unknown> = {};
    if (updates.assetType !== undefined) patch.assetType = updates.assetType;
    if (updates.campaignId !== undefined) patch.campaignId = updates.campaignId;
    if (updates.date !== undefined) patch.date = updates.date;
    if (updates.direction !== undefined) patch.direction = updates.direction;
    if (updates.notes !== undefined) patch.notes = updates.notes;
    if (updates.price !== undefined) patch.price = updates.price;
    if (updates.quantity !== undefined) patch.quantity = updates.quantity;
    if (updates.side !== undefined) patch.side = updates.side;
    if (updates.ticker !== undefined) patch.ticker = updates.ticker;

    await ctx.db.patch(tradeId, patch);

    return null;
  },
});

/**
 * Delete a trade record.
 */
export const deleteTrade = mutation({
  args: {
    tradeId: v.id("trades"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { tradeId } = args;

    const existingTrade = await ctx.db.get(tradeId);
    if (!existingTrade) {
      throw new Error("Trade not found");
    }

    await ctx.db.delete(tradeId);

    return null;
  },
});
