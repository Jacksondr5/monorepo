import {
  WeatherTagIds,
  DurationTagIds,
  TripTypeTagIds,
  TravelModeTagIds,
} from "~/lib/tags";
import type { Item } from "~/schemas/items";
import type { Luggage } from "~/schemas/luggage";

// Mock data for testing
export const mockItems: Item[] = [
  // Weather: Warm items
  {
    id: 1,
    name: "T-shirt",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [WeatherTagIds.WARM, DurationTagIds.PER_DAY],
  },
  {
    id: 2,
    name: "Shorts",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [WeatherTagIds.WARM, DurationTagIds.PER_DAY],
  },
  // Weather: Cold items
  {
    id: 3,
    name: "Sweater",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [WeatherTagIds.COLD, DurationTagIds.PER_DAY],
  },
  {
    id: 4,
    name: "Jacket",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [WeatherTagIds.COLD, DurationTagIds.BASE],
  },
  // Weather: Rain items
  {
    id: 11,
    name: "Rain Jacket",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [WeatherTagIds.RAIN, DurationTagIds.BASE],
  },
  // Weather: Any items
  {
    id: 5,
    name: "Socks",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [WeatherTagIds.ANY, DurationTagIds.PER_DAY],
  },
  {
    id: 6,
    name: "Underwear",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [WeatherTagIds.ANY, DurationTagIds.PER_DAY],
  },
  // Trip type: Business items
  {
    id: 7,
    name: "Dress shirt",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [
      WeatherTagIds.ANY,
      DurationTagIds.PER_DAY,
      TripTypeTagIds.BUSINESS,
    ],
  },
  {
    id: 8,
    name: "Suit",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [WeatherTagIds.ANY, DurationTagIds.BASE, TripTypeTagIds.BUSINESS],
  },
  // Trip type: Personal items
  {
    id: 12,
    name: "Casual shirt",
    userId: "user1",
    categoryId: 1, // Clothing
    tagIds: [
      WeatherTagIds.ANY,
      DurationTagIds.PER_DAY,
      TripTypeTagIds.PERSONAL,
    ],
  },
  // Travel mode restricted items
  {
    id: 9,
    name: "Large shampoo bottle",
    userId: "user1",
    categoryId: 2, // Toiletries
    tagIds: [
      WeatherTagIds.ANY,
      DurationTagIds.BASE,
      TravelModeTagIds.CHECKED_BAG,
    ],
  },
  {
    id: 10,
    name: "Travel-size toothpaste",
    userId: "user1",
    categoryId: 2, // Toiletries
    tagIds: [WeatherTagIds.ANY, DurationTagIds.BASE, TravelModeTagIds.CARRY_ON],
  },
  // Car travel specific item
  {
    id: 13,
    name: "Large cooler",
    userId: "user1",
    categoryId: 3, // Other
    tagIds: [WeatherTagIds.ANY, DurationTagIds.BASE, TravelModeTagIds.CAR],
  },
  // Item for Conflicting Tag Test (Test 19)
  {
    id: 14,
    name: "Conflicting Weather Item",
    userId: "user1",
    categoryId: 1,
    tagIds: [WeatherTagIds.WARM, WeatherTagIds.COLD, DurationTagIds.BASE],
  },
  // Item for Invalid Tag Test (Test 21)
  {
    id: 15,
    name: "Item with Invalid Tag",
    userId: "user1",
    categoryId: 3,
    tagIds: [
      9999, // Invalid tag
      DurationTagIds.BASE,
    ],
  },
];

export const mockLuggage: Luggage[] = [
  {
    id: 1,
    name: "Small carry-on",
    userId: "user1",
    capacityDays: 3,
    travelModeTagIds: [TravelModeTagIds.CARRY_ON],
  },
  {
    id: 2,
    name: "Medium checked bag",
    userId: "user1",
    capacityDays: 7,
    travelModeTagIds: [TravelModeTagIds.CHECKED_BAG],
  },
  {
    id: 3,
    name: "Large suitcase",
    userId: "user1",
    capacityDays: 14,
    travelModeTagIds: [TravelModeTagIds.CHECKED_BAG, TravelModeTagIds.CAR],
  },
  {
    id: 4,
    name: "Car trunk",
    userId: "user1",
    capacityDays: 21,
    travelModeTagIds: [TravelModeTagIds.CAR],
  },
  {
    id: 5,
    name: "Small weekend bag",
    userId: "user1",
    capacityDays: 2,
    travelModeTagIds: [TravelModeTagIds.CARRY_ON, TravelModeTagIds.CAR],
  },
];
