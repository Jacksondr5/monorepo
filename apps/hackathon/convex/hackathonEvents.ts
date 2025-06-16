import { query } from "./_generated/server";
import { serializeResult } from "./model/error";
import {
  getLatestHackathonEvent as modelGetLatestHackathonEvent,
  GetLatestHackathonEventError,
} from "./model/hackathonEvents";

// Re-export error types for backward compatibility
export type { GetLatestHackathonEventError };

export const getLatestHackathonEvent = query({
  args: {},
  handler: (ctx) => serializeResult(modelGetLatestHackathonEvent(ctx)),
});
