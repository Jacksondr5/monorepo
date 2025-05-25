# Data Model

This document outlines the proposed data structures for the Packing List application. Structures intended for database persistence are defined first, followed by the structure for the ephemeral packing list stored locally in the browser.

These are defined using Zod schemas to enable runtime validation.

```typescript
import { z } from "zod";

// Represents a predefined, centrally managed tag used for categorization and rule logic.
// Examples: "Weather: Warm", "Trip Type: Business", "Travel Mode: Carry-on"
const TagSchema = z.object({
  id: z.string().uuid(), // Assuming UUIDs for IDs
  name: z.string().min(1), // Enforce non-empty name
});
// Note: Database-level uniqueness for 'name' needs separate handling.

// Represents a category for items (e.g., "Clothing", "Toiletries")
const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});
// Note: Database-level uniqueness for 'name' needs separate handling.

// Represents a packable item in the master list
const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  categoryId: z.string().uuid().nullable().optional(), // Optional foreign key
  tagIds: z.array(z.string().uuid()), // Array of foreign keys referencing predefined Tag.id values
  // indicating rules (weather, trip type, duration, etc.)
});
// Note: Database-level uniqueness for 'name' needs separate handling.

// Represents a piece of luggage in the master list
const LuggageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  capacityDays: z.number().int().positive(), // Must be a positive integer
  travelModeTagIds: z.array(z.string().uuid()).min(1), // Array of foreign keys referencing predefined Tag.id values
  // corresponding to travel modes (e.g., "Travel Mode: Carry-on")
});
// Note: Database-level uniqueness for 'name' needs separate handling.

// --- Structure for Local Storage ---

// Represents an item within the currently active packing list
const PackingListItemSchema = z.object({
  itemId: z.string().uuid(), // Reference to the master Item.id
  name: z.string().min(1), // Copied item name
  quantity: z.number().int().positive(), // Calculated quantity
  isPacked: z.boolean().default(false), // Default to not packed
});

// Represents the currently active packing list stored in the browser
const CurrentPackingListSchema = z.object({
  generatedAt: z.date(), // Timestamp when the list was generated
  tripDetails: z.object({
    destination: z.string().min(1),
    startDate: z.date(),
    endDate: z.date(),
    tripTypeTagId: z.string().uuid(), // Reference to Tag.id
    travelModeTagId: z.string().uuid(), // Reference to Tag.id
    // Assuming dailyWeatherTagIds array length matches trip duration requires custom validation logic outside the basic schema
    dailyWeatherTagIds: z.array(z.string().uuid()),
  }),
  suggestedLuggageIds: z.array(z.string().uuid()), // List of Luggage.id
  items: z.array(PackingListItemSchema), // The list of items
});

// Example usage for parsing/validation:
// const parsedTag = TagSchema.parse({ id: "...", name: "..." });
// const parsedList = CurrentPackingListSchema.parse(dataFromLocalStorage);
```
