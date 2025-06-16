import { query, QueryCtx } from "./_generated/server";
import { Result, err, ok } from "neverthrow";
import { serializeResult } from "./model/error";
import {
  getLatestHackathonEvent,
  GetLatestHackathonEventError,
} from "./model/hackathonEvents";
import { getCurrentUser, GetCurrentUserError } from "./model/users";
import {
  getFinalizedProjectsByHackathonEvent,
  GetFinalizedProjectsByHackathonEventError,
} from "./model/finalizedProjects";
import { HackathonEventSchema } from "~/server/zod/hackathon-event";
import { UserSchema } from "~/server/zod/user";
import { z } from "zod";
import { FinalizedProjectListSchema } from "~/server/zod";

// Combined response schema for the project voting page
export const ProjectVotingDataSchema = z.object({
  hackathon: HackathonEventSchema,
  currentUser: UserSchema,
  finalizedProjects: FinalizedProjectListSchema,
});

export type ProjectVotingData = z.infer<typeof ProjectVotingDataSchema>;

export type GetProjectVotingDataError =
  | GetLatestHackathonEventError
  | GetCurrentUserError
  | GetFinalizedProjectsByHackathonEventError;

const _getProjectVotingDataHandler = async (
  ctx: QueryCtx,
): Promise<Result<ProjectVotingData, GetProjectVotingDataError>> => {
  // First, get the latest hackathon event
  const hackathonResult = await getLatestHackathonEvent(ctx);
  if (hackathonResult.isErr()) return err(hackathonResult.error);
  const hackathon = hackathonResult.value;

  // Get the current user
  const currentUserResult = await getCurrentUser(ctx);
  if (currentUserResult.isErr()) return err(currentUserResult.error);
  const currentUser = currentUserResult.value;

  // Get finalized projects for this hackathon event
  const finalizedProjectsResult = await getFinalizedProjectsByHackathonEvent(
    ctx,
    hackathon._id,
  );
  if (finalizedProjectsResult.isErr())
    return err(finalizedProjectsResult.error);
  const finalizedProjects = finalizedProjectsResult.value;
  return ok({
    hackathon,
    currentUser,
    finalizedProjects,
  });
};

export const getProjectVotingData = query({
  args: {},
  handler: (ctx) => serializeResult(_getProjectVotingDataHandler(ctx)),
});
