import { HackathonPhase, HackathonPhaseValues } from "~/server/zod";

export const projectStatusMessages = {
  [HackathonPhaseValues.PROJECT_SUBMISSION]: "Project Submission",
  [HackathonPhaseValues.PROJECT_VOTING]: "Project Voting",
  [HackathonPhaseValues.EVENT_IN_PROGRESS]: "Event in Progress",
  [HackathonPhaseValues.EVENT_ENDED]: "Event Ended",
} satisfies Record<HackathonPhase, string>;
