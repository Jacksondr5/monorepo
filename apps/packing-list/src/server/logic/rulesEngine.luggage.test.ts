import { describe, it, expect } from "vitest";
import { generatePackingList } from "./rulesEngine";
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

describe.todo("Rules Engine - Luggage Suggestion Rules", () => {
  // Test 16: Capacity Based Luggage Test
  it("should suggest luggage with sufficient capacity for the trip duration", () => {
    // 10-day trip
    const context: TripContext = {
      tripWeatherForecast: Array<WeatherTagId>(10).fill(
        WeatherTagIds.WARM as WeatherTagId,
      ),
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
      travelModeTagId: TravelModeTagIds.CHECKED_BAG as TravelModeTagId,
    };

    const result = generatePackingList(context, mockItems, mockLuggage);

    // Should suggest large suitcase (14 days) as it's the best fit >= 10 days for CHECKED_BAG
    expect(result.suggestedLuggageIds).toEqual([3]); // Large suitcase
    expect(result.suggestedLuggageIds).not.toContain(2); // Medium bag (too small)
  });

  // Test 16b: Capacity Based Luggage Test - Closer Small Bag
  it("should suggest the closest capacity match when multiple bags fit", () => {
    // 6-day trip, CHECKED_BAG mode
    const context: TripContext = {
      tripWeatherForecast: Array<WeatherTagId>(6).fill(
        WeatherTagIds.WARM as WeatherTagId,
      ),
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
      travelModeTagId: TravelModeTagIds.CHECKED_BAG as TravelModeTagId,
    };

    const result = generatePackingList(context, mockItems, mockLuggage);

    // Medium bag (7 days) is a closer fit than Large suitcase (14 days)
    expect(result.suggestedLuggageIds).toEqual([2]); // Medium checked bag
  });

  // Test 16c: Capacity Based Luggage Test - Exact Match
  it("should suggest the luggage with exact capacity match if available", () => {
    // 3-day trip, CARRY_ON mode
    const context: TripContext = {
      tripWeatherForecast: Array<WeatherTagId>(3).fill(
        WeatherTagIds.WARM as WeatherTagId,
      ),
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
      travelModeTagId: TravelModeTagIds.CARRY_ON as TravelModeTagId,
    };

    const result = generatePackingList(context, mockItems, mockLuggage);

    // Small carry-on (3 days) is an exact match
    expect(result.suggestedLuggageIds).toEqual([1]); // Small carry-on
  });

  // Test 17: Travel Mode Luggage Compatibility Test
  it("should only suggest luggage compatible with the selected travel mode", () => {
    const context: TripContext = {
      tripWeatherForecast: [
        WeatherTagIds.WARM as WeatherTagId,
        WeatherTagIds.WARM as WeatherTagId,
      ],
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
      travelModeTagId: TravelModeTagIds.TRAIN as TravelModeTagId, // Assuming TRAIN exists but no luggage has it
    };

    // Filter mock luggage to ensure none have TRAIN tag for this test
    const luggageWithoutTrain = mockLuggage.filter(
      (bag) =>
        !bag.travelModeTagIds.includes(
          TravelModeTagIds.TRAIN as TravelModeTagId,
        ),
    );

    const result = generatePackingList(context, mockItems, luggageWithoutTrain);

    // None of our luggage is tagged for train travel
    expect(result.suggestedLuggageIds).toHaveLength(0);
  });

  // Test 18: No Suitable Luggage Test (Capacity too small)
  it("should handle having no suitable luggage due to capacity", () => {
    // 100-day trip, CHECKED_BAG mode
    const context: TripContext = {
      tripWeatherForecast: Array<WeatherTagId>(100).fill(
        WeatherTagIds.ANY as WeatherTagId,
      ),
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
      travelModeTagId: TravelModeTagIds.CHECKED_BAG as TravelModeTagId,
    };

    const result = generatePackingList(context, mockItems, mockLuggage);

    // No checked bag has capacity >= 100
    // Current logic sorts by absolute difference, might pick the largest (14 days) even if too small.
    // Let's assert it picks the largest available compatible one.
    expect(result.suggestedLuggageIds).toEqual([3]); // Large Suitcase (14 days) - closest capacity
    // A different requirement might be to return [] if no bag *meets* capacity.
    // Modify test if requirements change.
  });

  // Test 18b: No Suitable Luggage Test (No compatible mode)
  it("should handle having no suitable luggage due to incompatible mode", () => {
    const context: TripContext = {
      tripWeatherForecast: [
        WeatherTagIds.WARM as WeatherTagId,
        WeatherTagIds.WARM as WeatherTagId,
      ],
      tripTypeTagId: TripTypeTagIds.PERSONAL as TripTypeTagId,
      travelModeTagId: 999 as TravelModeTagId, // Non-existent travel mode
    };

    const result = generatePackingList(context, mockItems, mockLuggage);

    // Should return empty luggage suggestions as no luggage matches mode 999
    expect(result.suggestedLuggageIds).toHaveLength(0);

    // Should still recommend items
    expect(result.items.length).toBeGreaterThan(0);
  });
});
