import { describe, it, expect } from "vitest";
import {
  WeatherTagIds,
  TripTypeTagIds,
  TravelModeTagIds,
  type WeatherTagId,
  type TripTypeTagId,
  type TravelModeTagId,
} from "../../lib/tags";
import type { TripContext } from "../../lib/tripContext";
import { mockItems, mockLuggage } from "./rulesEngine.test.data";
import { generateItems } from "./items/generateItems";
import type { Luggage } from "../../schemas/luggage";

// Helper to create a full context
const createFullContext = (details: Partial<TripContext> = {}): TripContext => {
  const defaultWeather = [WeatherTagIds.WARM as WeatherTagId];
  return {
    tripWeatherForecast: defaultWeather,
    tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    travelModeTagId: TravelModeTagIds.CARRY_ON as TravelModeTagId,
    ...details,
  };
};

// Get a mock luggage item by ID
const getLuggageById = (id: number): Luggage | undefined =>
  mockLuggage.find((l) => l.id === id);

describe.todo("Item Generation Logic - Duration Rules", () => {
  const selectedLuggageChecked = getLuggageById(2); // Medium Checked Bag
  const selectedLuggageCarryOn = getLuggageById(1); // Small Carry-on

  // Test 12: Duration: Base Items
  it("should include exactly one of each applicable BASE item", () => {
    const context = createFullContext({
      tripWeatherForecast: [
        WeatherTagIds.WARM as WeatherTagId,
        WeatherTagIds.WARM as WeatherTagId,
        WeatherTagIds.WARM as WeatherTagId,
      ],
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedLuggageChecked);

    // Find applicable BASE items in the result
    const baseItemIds = mockItems
      .filter((i) => i.tagIds.includes(8)) // DurationTagIds.BASE is 8
      .map((i) => i.id);
    const resultBaseItems = result.filter((i) =>
      baseItemIds.includes(i.itemId),
    );

    // Check quantities (should be 1) and filter based on context/luggage
    // Expected applicable BASE items for WARM, PERSONAL, CHECKED BAG:
    // 9 (Shampoo), 10 (Toothpaste - Carry-on OK in checked)
    const expectedBaseIds = [9, 10];

    expect(resultBaseItems.length).toBe(expectedBaseIds.length);
    resultBaseItems.forEach((item) => {
      expect(item.quantity).toBe(1);
      expect(expectedBaseIds).toContain(item.itemId);
    });
  });

  // Test 13: Duration: Per-Day Items
  it("should include applicable PER_DAY items with quantity matching trip days", () => {
    const tripDuration = 4;
    const context = createFullContext({
      tripWeatherForecast: Array<WeatherTagId>(tripDuration).fill(
        WeatherTagIds.WARM as WeatherTagId,
      ),
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedLuggageChecked);

    // Find applicable PER_DAY items in the result
    const perDayItemIds = mockItems
      .filter((i) => i.tagIds.includes(7)) // DurationTagIds.PER_DAY is 7
      .map((i) => i.id);
    const resultPerDayItems = result.filter((i) =>
      perDayItemIds.includes(i.itemId),
    );

    // Check quantities (should be tripDuration) and filter based on context/luggage
    // Expected applicable PER_DAY for WARM, PERSONAL, CHECKED BAG:
    // 1 (T-shirt), 2 (Shorts), 5 (Socks), 6 (Underwear), 12 (Casual Shirt)
    const expectedPerDayIds = [1, 2, 5, 6, 12];

    expect(resultPerDayItems.length).toBe(expectedPerDayIds.length);
    resultPerDayItems.forEach((item) => {
      expect(item.quantity).toBe(tripDuration);
      expect(expectedPerDayIds).toContain(item.itemId);
    });
  });

  // Test 14: Duration: Mixed Items
  it("should handle both BASE and PER_DAY items correctly", () => {
    const tripDuration = 2;
    const context = createFullContext({
      tripWeatherForecast: Array<WeatherTagId>(tripDuration).fill(
        WeatherTagIds.COLD as WeatherTagId,
      ),
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedLuggageChecked);

    // Expected BASE for COLD, PERSONAL, CHECKED BAG: 4 (Jacket), 9 (Shampoo), 10 (Toothpaste)
    const expectedBaseIds = [4, 9, 10];
    // Expected PER_DAY for COLD, PERSONAL, CHECKED BAG: 3 (Sweater), 5 (Socks), 6 (Underwear), 12 (Casual Shirt)
    const expectedPerDayIds = [3, 5, 6, 12];

    const baseItemIds = mockItems
      .filter((i) => i.tagIds.includes(8))
      .map((i) => i.id);
    const perDayItemIds = mockItems
      .filter((i) => i.tagIds.includes(7))
      .map((i) => i.id);

    result.forEach((item) => {
      if (baseItemIds.includes(item.itemId)) {
        expect(expectedBaseIds).toContain(item.itemId);
        expect(item.quantity).toBe(1);
      } else if (perDayItemIds.includes(item.itemId)) {
        expect(expectedPerDayIds).toContain(item.itemId);
        expect(item.quantity).toBe(tripDuration);
      }
    });

    // Check total count matches expected counts
    expect(result.length).toBe(
      expectedBaseIds.length + expectedPerDayIds.length,
    );
  });

  // Test 15: Duration: Zero-Day Trip
  it("should handle zero-day trip (only BASE items)", () => {
    const context = createFullContext({
      tripWeatherForecast: [], // Zero days
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedLuggageCarryOn);

    // Expected BASE for PERSONAL, CARRY_ON: 10 (Toothpaste)
    const expectedBaseIds = [10];

    // Find applicable BASE items in the result
    const baseItemIds = mockItems
      .filter((i) => i.tagIds.includes(8)) // DurationTagIds.BASE is 8
      .map((i) => i.id);
    const resultBaseItems = result.filter((i) =>
      baseItemIds.includes(i.itemId),
    );

    expect(resultBaseItems.length).toBe(expectedBaseIds.length);
    resultBaseItems.forEach((item) => {
      expect(item.quantity).toBe(1);
      expect(expectedBaseIds).toContain(item.itemId);
    });

    // Ensure no PER_DAY items are included
    const perDayItemIds = mockItems
      .filter((i) => i.tagIds.includes(7)) // DurationTagIds.PER_DAY is 7
      .map((i) => i.id);
    result.forEach((item) => {
      expect(perDayItemIds).not.toContain(item.itemId);
    });
  });
});
