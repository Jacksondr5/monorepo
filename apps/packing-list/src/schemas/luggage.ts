import { z } from "zod";

/**
 * Represents a piece of luggage in the master list (database model).
 */
export const LuggageSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  userId: z.string(), // From Clerk context
  capacityDays: z.number().int().positive(),
  travelModeTagIds: z.array(z.number().int()).min(1),
  // Add createdAt/updatedAt if needed from DB schema
});

export type Luggage = z.infer<typeof LuggageSchema>;
