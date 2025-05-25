import type {
  WeatherTagId,
  TripTypeTagId,
  TravelModeTagId,
  TagId,
} from "./tags";

// Define the input context for the trip
export type TripContext = {
  tripWeatherForecast: WeatherTagId[];
  tripTypeTagId: TripTypeTagId;
  travelModeTagId: TravelModeTagId;
};

export type Item = {
  id: number;
  name: string;
  tagIds: TagId[];
  userId: string;
};

export type PackingListItem = Item & {
  quantity: number;
  isPacked: boolean;
};

export type PackingList = {
  tripDetails: TripContext;
  luggageId: number;
  items: PackingListItem[];
};
