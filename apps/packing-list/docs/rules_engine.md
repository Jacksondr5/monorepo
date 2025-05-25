# Packing List Rules Engine

This document outlines the design and functionality of the rules engine for the packing list application. The engine's primary purpose is to first suggest suitable luggage options and then automatically suggest items to pack based on user-defined trip parameters, item/luggage configurations, and the user's selected luggage.

## Goals

- Suggest appropriate luggage options based on trip details (travel mode, duration).
- Automatically generate a packing list based on trip details and selected luggage.
- Consider item tags (weather, duration, trip type, etc.).
- Consider selected luggage travel mode restrictions when generating items.
- Allow users to customize and override suggestions.

## Core Concepts

1.  **Trip Context:** The input to the rules engine, containing details like:

    - Trip weather forecast, an array of WeatherTagIds
      - The length of this array gives you the total days
    - Trip Type (e.g., Business, Personal)
    - Travel Mode (e.g., Carry-on, Checked Bag, Car)

2.  **Items:** The pool of potential items to pack, each associated with:

    - Tags (Weather, Duration, Trip Type, etc.)
      - Each item should have exactly one weather tag (or the "Any" weather tag)
      - Each item may have a travel mode tag indicating restriction (e.g., only allowed in Checked Bag)
      - Multiple other types of tags are allowed
    - Category (Clothing, Toiletries, Electronics)

3.  **Luggage:** The pool of potential container(s) for the trip, defining:

    - Capacity (in days, a proxy for volume/item count)
    - Associated Travel Modes (Carry-on, Checked Bag, Car, Train)

4.  **User Selection:** After suggestions, the user selects one or more pieces of luggage.

5.  **Rules:** Logic that connects the Trip Context, Items, and Luggage to produce suggestions and the final list.

## Rule Examples

### Luggage Suggestion Rules:

- **Travel Mode Rule:** Suggest luggage whose `Associated Travel Modes` tag includes the trip's `Travel Mode`.
- **Capacity Rule:** Prioritize suggested luggage whose `Capacity (days)` is closest to (and ideally >=) the `Trip Duration`.

### Item Generation Rules (Post-Luggage Selection):

- **Weather Rule:** For each day in the forecast, include items with the matching weather tag or the ANY weather tag.
- **Duration Rule:**
  - Include applicable items tagged `Duration: Base` (quantity 1).
  - For applicable items tagged `Duration: Per Day`, include `Trip Duration` number of that item.
- **Trip Type Rule:** If `Trip Type = Business`, include applicable items tagged `Trip Type: Business` or items with no trip type tag.
- **Selected Luggage Rule:** If the _selected_ luggage is `Travel Mode: Carry-on`, exclude items tagged with `Travel Mode: Checked Bag`.

## Implementation Strategy

The logic will be split into two primary functions within the backend (`src/server/`):

1.  **`suggestLuggage(context, userLuggage)`:**

    - Takes `TripContext` (requiring duration and travel mode) and the user's `luggage` data.
    - Filters `userLuggage` based on compatibility with `context.travelModeTagId`.
    - Sorts compatible luggage based on `capacityDays` relative to trip duration.
    - Returns a list of suggested `luggage IDs`.

2.  **`generateItems(context, userItems, selectedLuggage)`:**
    - Takes `TripContext` (requiring weather, duration, type), the user's `items`, and the `selectedLuggage` object(s).
    - Filters `userItems` based on matching tags derived from the `TripContext` (Weather, Trip Type).
    - Filters items based on compatibility with the `selectedLuggage`'s travel mode restrictions.
    - Calculates quantities for 'per day' items based on trip duration.
    - Returns the final list of suggested `item` objects (with quantity, name, etc.).

## Future Considerations

- Rule prioritization/conflict resolution within item generation.
- Handling item volume/size vs. selected luggage capacity (requires modeling item/luggage volume).
- Integration with the frontend for displaying suggestions and allowing user modifications.
