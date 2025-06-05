import { z } from "zod";
import { query, QueryCtx } from "./_generated/server";
import { HackathonEventSchema } from "../src/server/zod/hackathon-event";
import { Result, err, fromPromise } from "neverthrow";
import {
  DataIsUnexpectedShapeError,
  NotFoundError,
  UnexpectedError,
  getNotFoundError,
  safeParseConvexArray,
  safeParseConvexObject,
  serializeResult,
} from "./model/error";

// Infer the type from the Zod schema
type HackathonEvent = z.infer<typeof HackathonEventSchema>;

// Error type for getHackathonEvents
export type GetHackathonEventsError =
  | DataIsUnexpectedShapeError
  | UnexpectedError;

const _getHackathonEventsHandler = async (
  ctx: QueryCtx,
): Promise<Result<HackathonEvent[], GetHackathonEventsError>> => {
  return fromPromise(
    ctx.db.query("hackathonEvents").collect(),
    (e): UnexpectedError => ({
      message: "Failed to fetch hackathon events.",
      originalError: e,
      type: "UNEXPECTED_ERROR",
    }),
  ).andThen((events) => {
    return safeParseConvexArray(HackathonEventSchema, events);
  });
};

export const getHackathonEvents = query({
  args: {},
  handler: (ctx) => serializeResult(_getHackathonEventsHandler(ctx)),
});

// Error type for getLatestHackathonEvent
export type GetLatestHackathonEventError =
  | DataIsUnexpectedShapeError
  | NotFoundError<"HACKATHON_EVENT">
  | UnexpectedError;

// TODO: Replace this with a better way of selecting the current hackathon event
const _getLatestHackathonEventHandler = async (
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

export const getLatestHackathonEvent = query({
  args: {},
  handler: (ctx) => serializeResult(_getLatestHackathonEventHandler(ctx)),
});
