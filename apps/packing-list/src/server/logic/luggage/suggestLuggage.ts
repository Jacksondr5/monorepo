import type { TripContext } from "~/lib/tripContext";
import type { Luggage } from "~/schemas/luggage";

/**
 * Suggests appropriate luggage based on travel mode and trip duration.
 *
 * @param context - Trip context containing travelModeTagId and tripWeatherForecast (for duration).
 * @param userLuggage - All luggage available to the user.
 * @returns The ID of the single best suggested luggage, or undefined if none suitable.
 */
export const suggestLuggage = (
  context: Pick<TripContext, "travelModeTagId" | "tripWeatherForecast">,
  userLuggage: Luggage[],
): number | undefined => {
  const tripDurationDays = context.tripWeatherForecast.length;

  // 1. Handle empty luggage list
  if (!userLuggage || userLuggage.length === 0) {
    return undefined;
  }

  // 2. Filter by travel mode compatibility
  const compatibleLuggage = userLuggage.filter((bag) =>
    bag.travelModeTagIds.includes(context.travelModeTagId),
  );

  // 3. Handle no compatible luggage
  if (compatibleLuggage.length === 0) {
    return undefined;
  }

  // 4. Sort all compatible luggage by capacity (ascending)
  const sortedCompatible = [...compatibleLuggage].sort(
    (a, b) => a.capacityDays - b.capacityDays,
  );

  // 5. Filter for luggage that fits the duration
  const fittingLuggage = sortedCompatible.filter(
    (bag) => bag.capacityDays >= tripDurationDays,
  );

  // 6. If luggage fits, return the smallest fitting one
  if (fittingLuggage.length > 0) {
    // Since sortedCompatible was sorted ascending, the first element
    // in fittingLuggage is the smallest one that fits.
    return fittingLuggage[0]!.id;
  }

  // 7. If no luggage fits, return the largest compatible one
  // The last element of the ascending sorted list is the largest overall.
  return sortedCompatible[sortedCompatible.length - 1]!.id;
};
