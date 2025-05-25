import { z } from "zod";

import { PackingListItemSchema } from "./items";

/**
 * Represents the currently active packing list stored in the browser's local storage.
 */
export const CurrentPackingListSchema = z.object({
  tripDetails: z.object({
    destination: z.string().min(1),
    tripTypeTagId: z.number().int(), // Reference to Tag.id
    travelModeTagId: z.number().int(), // Reference to Tag.id
    dailyWeatherTagIds: z.array(z.number().int()),
  }),
  luggageId: z.number().int(), // Reference to Luggage.id
  items: z.array(PackingListItemSchema), // The list of items to be packed
});

export type CurrentPackingList = z.infer<typeof CurrentPackingListSchema>;
