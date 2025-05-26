import { describe, it, expect } from "vitest";
import {
  TravelModeTagIds,
  type TravelModeTagId,
  type WeatherTagId,
} from "../../../lib/tags";
import type { TripContext } from "../../../lib/tripContext";
import { mockLuggage } from "../rulesEngine.test.data";
import { suggestLuggage } from "./suggestLuggage";

// Helper to create a minimal context for luggage suggestion
const createLuggageContext = (
  durationDays: number,
  travelModeTagId: TravelModeTagId,
): Pick<TripContext, "travelModeTagId" | "tripWeatherForecast"> => ({
  travelModeTagId,
  tripWeatherForecast: Array<number>(durationDays).fill(0) as WeatherTagId[],
});

describe("Luggage Suggestion Logic", () => {
  // Test 1: Empty Luggage List Test
  it("should return undefined when user has no luggage", () => {
    const context = createLuggageContext(5, TravelModeTagIds.CARRY_ON);
    const result = suggestLuggage(context, []);
    expect(result).toBeUndefined();
  });

  // Test 2: Capacity Based Suggestion Test (Sufficient Capacity)
  it("should suggest luggage id with closest capacity >= duration", () => {
    const context = createLuggageContext(6, TravelModeTagIds.CHECKED_BAG);
    // Available checked bags: Medium (7 days), Large (14 days)
    const result = suggestLuggage(context, mockLuggage);
    // Expect Medium (7 days) as it's the closest fit >= 6
    expect(result).toBe(2);
  });

  // Test 2b: Capacity Based Suggestion Test (Exact Match)
  it("should suggest luggage id with exact capacity match", () => {
    const context = createLuggageContext(3, TravelModeTagIds.CARRY_ON);
    // Available carry-ons: Small (3 days), Weekend (2 days)
    const result = suggestLuggage(context, mockLuggage);
    // Expect Small (3 days) as it's an exact match
    expect(result).toBe(1);
  });

  // Test 3: Travel Mode Compatibility Test
  it("should only suggest luggage id compatible with travel mode", () => {
    const context = createLuggageContext(2, TravelModeTagIds.CARRY_ON);
    // Available carry-ons: Small (3 days, ID 1), Weekend (2 days, ID 5)
    const result = suggestLuggage(context, mockLuggage);
    // Expect Weekend bag (ID 5) as it's the closest capacity fit
    expect(result).toBe(5);
  });

  // Test 4: Mixed Travel Mode Luggage Test
  it("should suggest luggage id if any of its modes match the trip mode", () => {
    const context = createLuggageContext(10, TravelModeTagIds.CAR);
    // CAR compatible: Large Suitcase (14 days, ID 3), Car Trunk (21 days, ID 4), Weekend Bag (2 days, ID 5)
    const result = suggestLuggage(context, mockLuggage);
    // Expect Large Suitcase (14 days) as it's the closest capacity >= 10
    expect(result).toBe(3);
  });

  // Test 5: No Suitable Luggage (Capacity Test)
  it("should suggest largest compatible bag id if duration exceeds all capacities", () => {
    const context = createLuggageContext(30, TravelModeTagIds.CHECKED_BAG);
    // Checked bags: Medium (7 days, ID 2), Large (14 days, ID 3)
    const result = suggestLuggage(context, mockLuggage);
    // Expect Large Suitcase (14 days) as it's the largest checked bag available
    expect(result).toBe(3);
  });

  // Test 6: No Suitable Luggage (Travel Mode Test)
  it("should return undefined if no luggage matches travel mode", () => {
    const context = createLuggageContext(5, 999 as TravelModeTagId); // Invalid/unmatched mode
    const result = suggestLuggage(context, mockLuggage);
    expect(result).toBeUndefined();
  });

  // Additional Test: Handling Zero-Day Trips
  it("should suggest smallest compatible bag id for zero-day trip", () => {
    const context = createLuggageContext(0, TravelModeTagIds.CARRY_ON);
    // Carry-ons: Small (3 days, ID 1), Weekend (2 days, ID 5)
    const result = suggestLuggage(context, mockLuggage);
    // Expect Weekend Bag (2 days) as it's the smallest capacity (closest to 0)
    expect(result).toBe(5);
  });
});
