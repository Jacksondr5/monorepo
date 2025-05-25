# Rules Engine Unit Tests

This document outlines the unit tests needed to verify the packing list generation logic, which is now split into two main steps:

1.  **Luggage Suggestion:** Suggesting suitable luggage based on travel mode and trip duration.
2.  **Item Generation:** Generating the item list based on trip details and the user's selected luggage.

Each test focuses on a specific aspect of one of these steps.

## Luggage Suggestion Logic Tests

These tests verify the logic for suggesting luggage based on the user's available luggage collection, the trip's travel mode, and duration.

1.  **Empty Luggage List Test**

    - Given: Empty user luggage list, any trip context.
    - Expected: Empty list of suggested luggage IDs.

2.  **Capacity Based Suggestion Test**

    - Given: Trip duration, various luggage with different capacities, compatible travel mode.
    - Expected: Suggests luggage ID(s) with the closest capacity meeting or exceeding trip duration.

3.  **Travel Mode Compatibility Test**

    - Given: Specific travel mode (e.g., CARRY_ON), luggage with various travel mode tags.
    - Expected: Only suggests luggage compatible with the selected travel mode.

4.  **Mixed Travel Mode Luggage Test**

    - Given: Travel mode (e.g., CAR), luggage tagged with multiple modes (e.g., CARRY_ON, CAR).
    - Expected: Suggests the luggage if its tags include the trip's travel mode.

5.  **No Suitable Luggage (Capacity) Test**

    - Given: Trip duration exceeding capacity of all compatible luggage.
    - Expected: Suggestion of the largest compatible luggage.

6.  **No Suitable Luggage (Travel Mode) Test**
    - Given: Trip travel mode not matching any available luggage tags.
    - Expected: Empty list of suggested luggage IDs.

## Item Generation Logic Tests

These tests verify the logic for generating the list of items and their quantities, based on the trip context (weather, duration, type) and the properties of the _user-selected_ luggage (primarily its travel mode restrictions).

7.  **Empty Item List Test**

    - Given: Empty user item list, any trip context, any selected luggage.
    - Expected: Empty item list in the result.

8.  **Basic Item Filtering (Weather)**

    - Given: Trip with specific weather (e.g., all WARM), user items with various weather tags, selected luggage allowing all items.
    - Expected: Only items with WARM or ANY weather tag included.

9.  **Mixed Weather Items**

    - Given: Trip with mixed weather (WARM, RAIN), user items, selected luggage allowing all items.
    - Expected: Appropriate mix of items for WARM, RAIN, and ANY weather included.

10. **ANY Weather Items Inclusion**

    - Given: Trip with any weather, items tagged ANY weather, selected luggage allowing all items.
    - Expected: ANY weather items included (if other tags match).

11. **Weather Without Matching Items**

    - Given: Trip with weather having no matching items, selected luggage allowing all items.
    - Expected: No items for that specific weather type, but other valid items (e.g., ANY) included.

12. **Duration: Base Items**

    - Given: Trip context, items tagged BASE duration, suitable selected luggage.
    - Expected: Exactly one of each applicable BASE item included.

13. **Duration: Per-Day Items**

    - Given: Multi-day trip, items tagged PER_DAY duration, suitable selected luggage.
    - Expected: Quantity matches the number of days in the trip for applicable PER_DAY items.

14. **Duration: Mixed Items**

    - Given: Trip context, both BASE and PER_DAY items, suitable selected luggage.
    - Expected: Applicable BASE items have quantity=1, applicable PER_DAY items have quantity=trip_days.

15. **Duration: Zero-Day Trip**

    - Given: Trip with zero days, user items, suitable selected luggage.
    - Expected: Only applicable BASE items included, quantity=1.

16. **Trip Type: Business**

    - Given: BUSINESS trip type, items with BUSINESS/PERSONAL/no tags, suitable selected luggage.
    - Expected: Only items with BUSINESS or no trip type tag included.

17. **Trip Type: Personal**

    - Given: PERSONAL trip type, items with BUSINESS/PERSONAL/no tags, suitable selected luggage.
    - Expected: Only items with PERSONAL or no trip type tag included.

18. **Item Filtering by Selected Luggage (Carry-on)**

    - Given: Trip context, user items (some restricted to CHECKED_BAG), user has selected CARRY_ON luggage.
    - Expected: Items restricted to CHECKED*BAG are \_not* included, carry-on specific items _are_ included.

19. **Item Filtering by Selected Luggage (Checked Bag)**

    - Given: Trip context, user items (some restricted to CHECKED_BAG), user has selected CHECKED_BAG luggage.
    - Expected: Items restricted to CHECKED*BAG \_are* included (as are carry-on compatible items).

20. **Item Filtering by Selected Luggage (Car)**
    - Given: Trip context, user items (some restricted), user has selected CAR luggage.
    - Expected: All items included (assuming CAR has no restrictions, TBD).
