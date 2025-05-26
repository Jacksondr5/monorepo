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
import { mockItems, mockLuggage } from "./rulesEngine.test.data"; // Path relative to test file
import { generateItems } from "./items/generateItems"; // Path relative to test file
import type { Luggage } from "../../schemas/luggage";

// Helper to create a full context (can be shared or simplified if needed)
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

// Helper to get item IDs from result
const getItemIds = (result: ReturnType<typeof generateItems>): number[] =>
  result.map((i) => i.itemId);

describe.todo("Item Generation Logic - Weather Rules", () => {
  const selectedLuggageAllowAll = getLuggageById(3); // Large Suitcase (Checked + Car), assume allows all for basic weather tests

  // Test 8: Basic Item Filtering (Weather)
  it("should include only items with matching weather or ANY tag", () => {
    const context = createFullContext({
      tripWeatherForecast: [
        WeatherTagIds.WARM as WeatherTagId,
        WeatherTagIds.WARM as WeatherTagId,
        WeatherTagIds.WARM as WeatherTagId,
      ],
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
      // travelModeTagId in context is less relevant here
    });

    const result = generateItems(context, mockItems, selectedLuggageAllowAll);
    const resultIds = getItemIds(result);

    // Warm items + ANY items (filtered only by trip type PERSONAL)
    const expectedItems = [1, 2, 5, 6, 9, 10, 12, 13, 14]; // All WARM/ANY except Business (7, 8) and Invalid (15)

    expect(resultIds).toEqual(expect.arrayContaining(expectedItems));
    expect(resultIds).not.toContain(3); // Cold: Sweater
    expect(resultIds).not.toContain(4); // Cold: Jacket
    expect(resultIds).not.toContain(11); // Rain: Rain Jacket
    expect(resultIds).not.toContain(7); // Business item
    expect(resultIds).not.toContain(8); // Business item
    expect(resultIds).not.toContain(15); // Invalid tag item
    expect(resultIds.length).toBe(expectedItems.length);
  });

  // Test 9: Mixed Weather Items
  it("should include items for mixed weather conditions", () => {
    const context = createFullContext({
      tripWeatherForecast: [
        WeatherTagIds.WARM as WeatherTagId,
        WeatherTagIds.COLD as WeatherTagId,
        WeatherTagIds.RAIN as WeatherTagId,
      ],
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedLuggageAllowAll);
    const resultIds = getItemIds(result);

    // Should include items for all three weather types + ANY (filtered by PERSONAL)
    expect(resultIds).toContain(1); // Warm: T-shirt
    expect(resultIds).toContain(2); // Warm: Shorts
    expect(resultIds).toContain(3); // Cold: Sweater
    expect(resultIds).toContain(4); // Cold: Jacket (Base)
    expect(resultIds).toContain(11); // Rain: Rain Jacket (Base)
    expect(resultIds).toContain(5); // Socks (any weather)
    expect(resultIds).toContain(6); // Underwear (any weather)
    expect(resultIds).toContain(9); // Shampoo (any weather)
    expect(resultIds).toContain(10); // Toothpaste (any weather)
    expect(resultIds).toContain(12); // Casual Shirt (any weather, personal)
    expect(resultIds).toContain(13); // Cooler (any weather)
    expect(resultIds).toContain(14); // Conflicting weather (assuming first tag WARM applies)

    // Should not include Business or Invalid
    expect(resultIds).not.toContain(7); // Business
    expect(resultIds).not.toContain(8); // Business
    expect(resultIds).not.toContain(15); // Invalid
  });

  // Test 10: ANY Weather Items Inclusion
  it("should always include ANY weather items (if other tags match)", () => {
    const context = createFullContext({
      tripWeatherForecast: [
        WeatherTagIds.COLD as WeatherTagId,
        WeatherTagIds.COLD as WeatherTagId,
      ],
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedLuggageAllowAll);
    const resultIds = getItemIds(result);

    // ANY weather items compatible with PERSONAL should be included
    const expectedAnyPersonalItems = [5, 6, 9, 10, 12, 13, 14]; // Includes conflicting item 14
    expectedAnyPersonalItems.forEach((id) => {
      expect(resultIds).toContain(id);
    });

    // Weather-specific items for non-matching weather should not be included
    expect(resultIds).not.toContain(1); // T-shirt (warm)
    expect(resultIds).not.toContain(2); // Shorts (warm)
    expect(resultIds).not.toContain(11); // Rain Jacket (rain)

    // Business items should not be included
    expect(resultIds).not.toContain(7); // Business
    expect(resultIds).not.toContain(8); // Business
    expect(resultIds).not.toContain(15); // Invalid
  });

  // Test 11: Weather Without Matching Items
  it("should handle a weather type with no matching items", () => {
    const context = createFullContext({
      tripWeatherForecast: [
        999 as WeatherTagId, // Non-existent weather tag
        WeatherTagIds.WARM as WeatherTagId,
      ],
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedLuggageAllowAll);
    const resultIds = getItemIds(result);

    // Should still include warm and ANY weather items compatible with PERSONAL
    expect(resultIds).toContain(1); // T-shirt (warm)
    expect(resultIds).toContain(2); // Shorts (warm)
    expect(resultIds).toContain(5); // Socks (ANY)
    expect(resultIds).toContain(6); // Underwear (ANY)
    expect(resultIds).toContain(9); // Shampoo (ANY)
    expect(resultIds).toContain(10); // Toothpaste (ANY)
    expect(resultIds).toContain(12); // Casual shirt (ANY, Personal)
    expect(resultIds).toContain(13); // Cooler (ANY)
    expect(resultIds).toContain(14); // Conflicting (Warm)

    // Should not include items for non-forecasted weather, business, or invalid
    expect(resultIds).not.toContain(3); // Cold
    expect(resultIds).not.toContain(4); // Cold
    expect(resultIds).not.toContain(11); // Rain
    expect(resultIds).not.toContain(7); // Business
    expect(resultIds).not.toContain(8); // Business
    expect(resultIds).not.toContain(15); // Invalid
  });
});
