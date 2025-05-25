import { z } from "zod";

/**
 * Represents a category for items (e.g., "Clothing", "Toiletries")
 */
export const CategorySchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  // Add createdAt/updatedAt if needed from DB schema
});

export type Category = z.infer<typeof CategorySchema>;
