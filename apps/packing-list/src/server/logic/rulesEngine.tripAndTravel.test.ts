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
    travelModeTagId: TravelModeTagIds.CARRY_ON as TravelModeTagId, // Less relevant for item generation
    ...details,
  };
};

// Get a mock luggage item by ID
const getLuggageById = (id: number): Luggage | undefined =>
  mockLuggage.find((l) => l.id === id);

// Helper to get item IDs from result
const getItemIds = (result: ReturnType<typeof generateItems>): number[] =>
  result.items.map((i) => i.itemId);

describe("Item Generation Logic - Trip Type & Selected Luggage Rules", () => {
  const selectedCarryOn = getLuggageById(1); // Small Carry-on
  const selectedCheckedBag = getLuggageById(2); // Medium Checked Bag
  const selectedCar = getLuggageById(4); // Car Trunk

  // Test 16: Trip Type: Business
  it.todo("should include BUSINESS or untyped items for BUSINESS trips", () => {
    const context = createFullContext({
      tripTypeTagId: TripTypeTagIds.BUSINESS as TripTypeTagId,
      tripWeatherForecast: [WeatherTagIds.ANY as WeatherTagId], // Simplify weather
    });

    // Assume checked bag allows all types for this test
    const result = generateItems(context, mockItems, selectedCheckedBag);
    const resultIds = getItemIds(result);

    // Should include business-specific (7, 8) and untyped ANY items
    expect(resultIds).toContain(7); // Dress shirt (business)
    expect(resultIds).toContain(8); // Suit (business)
    expect(resultIds).toContain(5); // Socks (any type)
    expect(resultIds).toContain(6); // Underwear (any type)
    expect(resultIds).toContain(9); // Shampoo (any type)
    expect(resultIds).toContain(10); // Toothpaste (any type)
    expect(resultIds).toContain(13); // Cooler (any type)
    expect(resultIds).toContain(14); // Conflicting (any type)

    // Should NOT include personal-specific items
    expect(resultIds).not.toContain(12); // Casual shirt (personal)

    // Should not include invalid items
    expect(resultIds).not.toContain(15);
  });

  // Test 17: Trip Type: Personal
  it.todo("should include PERSONAL or untyped items for PERSONAL trips", () => {
    const context = createFullContext({
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
      tripWeatherForecast: [WeatherTagIds.ANY as WeatherTagId], // Simplify weather
    });

    // Assume checked bag allows all types for this test
    const result = generateItems(context, mockItems, selectedCheckedBag);
    const resultIds = getItemIds(result);

    // Should include personal-specific (12) and untyped ANY items
    expect(resultIds).toContain(12); // Casual shirt (personal)
    expect(resultIds).toContain(5); // Socks (any type)
    expect(resultIds).toContain(6); // Underwear (any type)
    expect(resultIds).toContain(9); // Shampoo (any type)
    expect(resultIds).toContain(10); // Toothpaste (any type)
    expect(resultIds).toContain(13); // Cooler (any type)
    expect(resultIds).toContain(14); // Conflicting (any type)

    // Should NOT include business-specific items
    expect(resultIds).not.toContain(7); // Dress shirt (business)
    expect(resultIds).not.toContain(8); // Suit (business)

    // Should not include invalid items
    expect(resultIds).not.toContain(15);
  });

  // Test 18: Item Filtering by Selected Luggage (Carry-on)
  it.todo("should filter items based on selected CARRY_ON luggage", () => {
    const context = createFullContext({
      tripWeatherForecast: [WeatherTagIds.ANY as WeatherTagId], // Simplify weather
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedCarryOn);
    const resultIds = getItemIds(result);

    // Should include Carry-on compatible (10) and items with no restriction
    expect(resultIds).toContain(10); // Travel toothpaste (Carry-on)
    expect(resultIds).toContain(5); // Socks (No restriction)
    expect(resultIds).toContain(6); // Underwear (No restriction)
    expect(resultIds).toContain(12); // Casual shirt (Personal, No restriction)
    expect(resultIds).toContain(14); // Conflicting (No restriction)

    // Should not include CHECKED_BAG only items (9)
    expect(resultIds).not.toContain(9); // Large shampoo

    // Should not include CAR only items (13)
    expect(resultIds).not.toContain(13); // Large cooler

    // Should not include Business items
    expect(resultIds).not.toContain(7);
    expect(resultIds).not.toContain(8);
    // Should not include invalid
    expect(resultIds).not.toContain(15);
  });

  // Test 19: Item Filtering by Selected Luggage (Checked Bag)
  it.todo("should filter items based on selected CHECKED_BAG luggage", () => {
    const context = createFullContext({
      tripWeatherForecast: [WeatherTagIds.ANY as WeatherTagId],
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedCheckedBag);
    const resultIds = getItemIds(result);

    // Should include items restricted to CHECKED_BAG (9)
    expect(resultIds).toContain(9); // Large shampoo bottle

    // Should also include carry-on items (10)
    expect(resultIds).toContain(10); // Travel toothpaste

    // Should include items with no restriction
    expect(resultIds).toContain(5); // Socks
    expect(resultIds).toContain(6); // Underwear
    expect(resultIds).toContain(12); // Casual shirt
    expect(resultIds).toContain(14); // Conflicting

    // Should not include CAR only items (13)
    expect(resultIds).not.toContain(13); // Large cooler

    // Should not include Business or Invalid
    expect(resultIds).not.toContain(7);
    expect(resultIds).not.toContain(8);
    expect(resultIds).not.toContain(15);
  });

  // Test 20: Item Filtering by Selected Luggage (Car)
  it.todo("should filter items based on selected CAR luggage", () => {
    const context = createFullContext({
      tripWeatherForecast: [WeatherTagIds.ANY as WeatherTagId],
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
    });

    const result = generateItems(context, mockItems, selectedCar);
    const resultIds = getItemIds(result);

    // Should include car-specific items (13)
    expect(resultIds).toContain(13); // Large cooler

    // Should include CHECKED_BAG (9) and CARRY_ON (10) items (assuming CAR allows all)
    expect(resultIds).toContain(9); // Large shampoo
    expect(resultIds).toContain(10); // Travel toothpaste

    // Should include other applicable items
    expect(resultIds).toContain(5); // Socks
    expect(resultIds).toContain(6); // Underwear
    expect(resultIds).toContain(12); // Casual shirt
    expect(resultIds).toContain(14); // Conflicting

    // Should not include Business or Invalid
    expect(resultIds).not.toContain(7);
    expect(resultIds).not.toContain(8);
    expect(resultIds).not.toContain(15);
  });
});
