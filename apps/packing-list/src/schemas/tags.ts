import { z } from "zod";

/**
 * Represents a reusable tag (e.g., "Weather: Warm", "Trip Type: Business")
 */
export const TagSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  // Add createdAt/updatedAt if needed from DB schema
});

export type Tag = z.infer<typeof TagSchema>;
