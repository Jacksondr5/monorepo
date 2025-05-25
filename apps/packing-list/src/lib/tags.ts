/**
 * Constants and utilities for working with predefined tags
 * These match the IDs defined in docs/predefined_tags.md and seeded in drizzle/0001_seed_tags.sql.
 * If new tags are added, you should make a new migration to add them to the database.
 */

// Tag IDs grouped by category
export const TripTypeTagIds = {
  BUSINESS: 1,
  PERSONAL: 2,
} as const;

export type TripTypeTagId =
  (typeof TripTypeTagIds)[keyof typeof TripTypeTagIds];

export const WeatherTagIds = {
  WARM: 3,
  COLD: 4,
  RAIN: 5,
  ANY: 6,
} as const;

export type WeatherTagId = (typeof WeatherTagIds)[keyof typeof WeatherTagIds];

export const DurationTagIds = {
  BASE: 7,
  PER_DAY: 8,
} as const;

export type DurationTagId =
  (typeof DurationTagIds)[keyof typeof DurationTagIds];

export const TravelModeTagIds = {
  CARRY_ON: 9,
  CHECKED_BAG: 10,
  CAR: 11,
  TRAIN: 12,
} as const;

export type TravelModeTagId =
  (typeof TravelModeTagIds)[keyof typeof TravelModeTagIds];

// All tag IDs combined
export const TagIds = {
  ...TripTypeTagIds,
  ...WeatherTagIds,
  ...DurationTagIds,
  ...TravelModeTagIds,
} as const;

// Type representing valid tag IDs
export type TagId = (typeof TagIds)[keyof typeof TagIds];

// Category IDs
export const CategoryIds = {
  CLOTHING: 1,
  TOILETRIES: 2,
  ELECTRONICS: 3,
} as const;

export type CategoryId = (typeof CategoryIds)[keyof typeof CategoryIds];

// Helper functions
export function isTripTypeTagId(
  id: number,
): id is (typeof TripTypeTagIds)[keyof typeof TripTypeTagIds] {
  return id === TripTypeTagIds.BUSINESS || id === TripTypeTagIds.PERSONAL;
}

export function isWeatherTagId(
  id: number,
): id is (typeof WeatherTagIds)[keyof typeof WeatherTagIds] {
  return (
    id === WeatherTagIds.WARM ||
    id === WeatherTagIds.COLD ||
    id === WeatherTagIds.RAIN ||
    id === WeatherTagIds.ANY
  );
}

export function isDurationTagId(
  id: number,
): id is (typeof DurationTagIds)[keyof typeof DurationTagIds] {
  return id === DurationTagIds.BASE || id === DurationTagIds.PER_DAY;
}

export function isTravelModeTagId(
  id: number,
): id is (typeof TravelModeTagIds)[keyof typeof TravelModeTagIds] {
  return (
    id === TravelModeTagIds.CARRY_ON ||
    id === TravelModeTagIds.CHECKED_BAG ||
    id === TravelModeTagIds.CAR ||
    id === TravelModeTagIds.TRAIN
  );
}

// Tag name mapping (for display or when you need the name from ID)
export const TAG_NAMES: Record<TagId, string> = {
  [TripTypeTagIds.BUSINESS]: "Trip Type: Business",
  [TripTypeTagIds.PERSONAL]: "Trip Type: Personal",
  [WeatherTagIds.WARM]: "Weather: Warm",
  [WeatherTagIds.COLD]: "Weather: Cold",
  [WeatherTagIds.RAIN]: "Weather: Rain",
  [WeatherTagIds.ANY]: "Weather: Any",
  [DurationTagIds.BASE]: "Duration: Base",
  [DurationTagIds.PER_DAY]: "Duration: Per Day",
  [TravelModeTagIds.CARRY_ON]: "Travel Mode: Carry-on",
  [TravelModeTagIds.CHECKED_BAG]: "Travel Mode: Checked Bag",
  [TravelModeTagIds.CAR]: "Travel Mode: Car",
  [TravelModeTagIds.TRAIN]: "Travel Mode: Train",
} as const;

// Category name mapping
export const CATEGORY_NAMES: Record<CategoryId, string> = {
  [CategoryIds.CLOTHING]: "Clothing",
  [CategoryIds.TOILETRIES]: "Toiletries",
  [CategoryIds.ELECTRONICS]: "Electronics",
} as const;
