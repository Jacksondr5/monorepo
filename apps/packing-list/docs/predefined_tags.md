# Predefined Tags

This document lists the predefined tags used within the application for rule logic and categorization. The `name` field corresponds to the value stored in the `tags` database table. **The listed IDs are the specific values that should be used during database seeding and potentially referenced in application logic.**

## Trip Type Tags

Used to select items relevant to the type of trip. Mutually exclusive.

- `{ id: 1, name: "Trip Type: Business" }`
- `{ id: 2, name: "Trip Type: Personal" }`

## Weather Condition Tags

Associated with items based on their suitability for different weather conditions. Also used to tag daily forecasts.

- `{ id: 3, name: "Weather: Warm" }`
- `{ id: 4, name: "Weather: Cold" }`
- `{ id: 5, name: "Weather: Rain" }`
- `{ id: 6, name: "Weather: Any" }` (For items suitable regardless of weather)

## Duration Tags

Determines how item quantities are calculated based on trip length.

- `{ id: 7, name: "Duration: Base" }` (Quantity = 1 if conditions met)
- `{ id: 8, name: "Duration: Per Day" }` (Quantity based on number of matching days or total days)

## Travel Mode Tags

Used for suggesting luggage and potentially filtering items based on travel constraints (e.g., carry-on liquids).

- `{ id: 9, name: "Travel Mode: Carry-on" }`
- `{ id: 10, name: "Travel Mode: Checked Bag" }`
- `{ id: 11, name: "Travel Mode: Car" }`
- `{ id: 12, name: "Travel Mode: Train" }`
