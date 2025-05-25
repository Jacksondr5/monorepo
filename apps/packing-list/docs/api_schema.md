# API Schema (tRPC)

This document outlines the tRPC API procedures planned for the Packing List application.

---

**Notes:**

- All procedures below (except potentially public list operations if added later) are **protected** and require user authentication via Clerk.
- The `ctx` (context) object in tRPC procedures will provide the authenticated `userId`.
- Input/Output definitions use Zod-like syntax for clarity.
- IDs passed as input or included in output are expected to be integers based on the current database schema.
- **`Tag` and `Category` IDs reference predefined, manually assigned values** (see `docs/predefined_tags.md`). `Item` and `Luggage` IDs are database-generated.

---

**## Item Router (`item.*`)**

Handles CRUD operations for the user's master list of packable items.

### `item.list`

- **Purpose:** Fetches all items belonging to the authenticated user.
- **Input:** `z.void()`
- **Output:** `z.array(ItemSchema)`

### `item.create`

- **Purpose:** Creates a new item for the user.
- **Input:** `z.object({ name: z.string().min(1), categoryId: z.number().int().nullable().optional(), tagIds: z.array(z.number().int()) })`
- **Output:** `ItemSchema`

### `item.update`

- **Purpose:** Updates an existing item.
- **Input:** `z.object({ id: z.number().int(), name: z.string().min(1), categoryId: z.number().int().nullable().optional(), tagIds: z.array(z.number().int()) })`
- **Output:** `ItemSchema`

### `item.delete`

- **Purpose:** Deletes an item.
- **Input:** `z.object({ id: z.number().int() })`
- **Output:** `z.void()` (Success indicated by lack of server error / 2xx status code)

---

**## Luggage Router (`luggage.*`)**

Handles CRUD operations for the user's luggage collection.

### `luggage.list`

- **Purpose:** Fetches all luggage belonging to the authenticated user.
- **Input:** `z.void()`
- **Output:** `z.array(LuggageSchema)`

### `luggage.create`

- **Purpose:** Creates a new luggage item for the user.
- **Input:** `z.object({ name: z.string().min(1), capacityDays: z.number().int().positive(), travelModeTagIds: z.array(z.number().int()).min(1) })`
- **Output:** `LuggageSchema`

### `luggage.update`

- **Purpose:** Updates an existing luggage item.
- **Input:** `z.object({ id: z.number().int(), name: z.string().min(1), capacityDays: z.number().int().positive(), travelModeTagIds: z.array(z.number().int()).min(1) })`
- **Output:** `LuggageSchema`

### `luggage.delete`

- **Purpose:** Deletes a luggage item.
- **Input:** `z.object({ id: z.number().int() })`
- **Output:** `z.void()` (Success indicated by lack of server error / 2xx status code)

---

**## Tag Router (`tag.*`)**

Handles retrieving available **predefined** tags (used for UI selectors and rule logic).

### `tag.list`

- **Purpose:** Fetches all available predefined tags.
- **Input:** `z.void()`
- **Output:** `z.array(TagSchema)`

---

**## Category Router (`category.*`)**

Handles retrieving available categories.

### `category.list`

- **Purpose:** Fetches all available categories.
- **Input:** `z.void()`
- **Output:** `z.array(CategorySchema)`

---

**## Packing List Router (`packingList.*`)**

Handles the core logic of generating a packing list.

### `packingList.generate`

- **Purpose:** Generates a suggested packing list based on user input and defined rules.
- **Input:** `z.object({ destination: z.string().min(1), startDate: z.date(), endDate: z.date(), tripTypeTagId: z.number().int(), travelModeTagId: z.number().int() })`
- **Output:** `z.object({ suggestedLuggageIds: z.array(z.number().int()), items: z.array(z.object({ itemId: z.number().int(), name: z.string(), quantity: z.number().int() })) })`

---
