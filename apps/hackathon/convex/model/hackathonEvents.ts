import { QueryCtx } from "../_generated/server";
import { HackathonEventSchema } from "../../src/server/zod/hackathon-event";
import { Result, err, fromPromise } from "neverthrow";
import {
  DataIsUnexpectedShapeError,
  NotFoundError,
  UnexpectedError,
  getNotFoundError,
  safeParseConvexObject,
} from "./error";
import { z } from "zod";

// Infer the type from the Zod schema
type HackathonEvent = z.infer<typeof HackathonEventSchema>;

// Error type for getLatestHackathonEvent
export type GetLatestHackathonEventError =
  | DataIsUnexpectedShapeError
  | NotFoundError<"HACKATHON_EVENT">
  | UnexpectedError;

// TODO: Replace this with a better way of selecting the current hackathon event (JAC-78)
export const getLatestHackathonEvent = async (
  ctx: QueryCtx,
): Promise<Result<HackathonEvent, GetLatestHackathonEventError>> => {
  return fromPromise(
    ctx.db.query("hackathonEvents").order("desc").first(),
    (e): UnexpectedError => ({
      message: "Failed to fetch the latest hackathon event.",
      originalError: e,
      type: "UNEXPECTED_ERROR",
    }),
  ).andThen((latestEvent) => {
    if (!latestEvent) {
      return err(getNotFoundError("HACKATHON_EVENT", "latest"));
    }
    return safeParseConvexObject(HackathonEventSchema, latestEvent);
  });
};
