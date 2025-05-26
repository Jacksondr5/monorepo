import type { WeatherTagId, TripTypeTagId, TravelModeTagId } from "./tags";
import type { PackingListItem } from "../schemas/items";

// Define the input context for the trip
export type TripContext = {
  tripWeatherForecast: WeatherTagId[];
  tripTypeTagId: TripTypeTagId;
  travelModeTagId: TravelModeTagId;
};

export type PackingList = {
  tripDetails: TripContext;
  luggageId: number;
  items: PackingListItem[];
};
