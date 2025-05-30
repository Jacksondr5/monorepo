import { z } from "zod";
import { baseConvexFields } from "./utils";

export const HackathonPhaseSchema = z.enum([
  "IDEA_SUBMISSION",
  "PROJECT_VOTING",
  "EVENT_IN_PROGRESS",
  "EVENT_ENDED",
]);

export const HackathonEventSchema = z.object({
  ...baseConvexFields("hackathonEvents"),
  name: z.string().min(1),
  currentPhase: HackathonPhaseSchema.default("IDEA_SUBMISSION"),
});

export type HackathonEvent = z.infer<typeof HackathonEventSchema>;
export type HackathonPhase = z.infer<typeof HackathonPhaseSchema>;
