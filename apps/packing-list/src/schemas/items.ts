import { z } from "zod";

/**
 * Represents a packable item in the master list (database model).
 */
export const ItemSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  userId: z.string(), // From Clerk context
  categoryId: z.number().int().nullable().optional(),
  tagIds: z.array(z.number().int()), // Populated via relations
  // Add createdAt/updatedAt if needed from DB schema
});

export type Item = z.infer<typeof ItemSchema>;

/**
 * Represents an item within the currently active packing list (local storage).
 */
export const PackingListItemSchema = z.object({
  itemId: z.number().int(), // Reference to the master Item.id
  name: z.string().min(1), // Copied item name
  quantity: z.number().int().positive(), // Calculated quantity
  isPacked: z.boolean().default(false), // Default to not packed
});

export type PackingListItem = z.infer<typeof PackingListItemSchema>;
