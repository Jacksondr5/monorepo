import { z } from "zod";
import { baseConvexFields } from "./utils";
import { zid } from "convex-helpers/server/zod";

export const HackathonEventIdSchema = zid("hackathonEvents");

export const HackathonPhaseSchema = z.enum([
  "PROJECT_SUBMISSION",
  "PROJECT_VOTING",
  "EVENT_IN_PROGRESS",
  "EVENT_ENDED",
]);
export const HackathonPhaseValues = HackathonPhaseSchema.enum;

export const HackathonEventSchema = z.object({
  ...baseConvexFields("hackathonEvents"),
  name: z.string().min(1),
  currentPhase: HackathonPhaseSchema.default("PROJECT_SUBMISSION"),
});

export type HackathonEvent = z.infer<typeof HackathonEventSchema>;
export type HackathonPhase = z.infer<typeof HackathonPhaseSchema>;
