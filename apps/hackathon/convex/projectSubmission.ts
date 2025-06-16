import { query, QueryCtx } from "./_generated/server";
import { Result, err, ok } from "neverthrow";
import { serializeResult } from "./model/error";
import {
  getLatestHackathonEvent,
  GetLatestHackathonEventError,
} from "./model/hackathonEvents";
import { getCurrentUser, GetCurrentUserError } from "./model/users";
import {
  getProjectsByHackathonEvent,
  GetProjectsByHackathonEventError,
} from "./model/projects";
import { ProjectListSchema } from "~/server/zod/views/project-list";
import { HackathonEventSchema } from "~/server/zod/hackathon-event";
import { UserSchema } from "~/server/zod/user";
import { z } from "zod";

// Combined response schema for the project submission page
export const ProjectSubmissionDataSchema = z.object({
  hackathon: HackathonEventSchema,
  currentUser: UserSchema,
  projects: ProjectListSchema,
});

export type ProjectSubmissionData = z.infer<typeof ProjectSubmissionDataSchema>;

export type GetProjectSubmissionDataError =
  | GetLatestHackathonEventError
  | GetCurrentUserError
  | GetProjectsByHackathonEventError;

const _getProjectSubmissionDataHandler = async (
  ctx: QueryCtx,
): Promise<Result<ProjectSubmissionData, GetProjectSubmissionDataError>> => {
  // Get latest hackathon event and current user in parallel
  const [hackathonResult, currentUserResult] = await Promise.all([
    getLatestHackathonEvent(ctx),
    getCurrentUser(ctx),
  ]);

  if (hackathonResult.isErr()) return err(hackathonResult.error);
  if (currentUserResult.isErr()) return err(currentUserResult.error);

  const hackathon = hackathonResult.value;
  const currentUser = currentUserResult.value;

  // Get projects for this hackathon event
  const projectsResult = await getProjectsByHackathonEvent(ctx, hackathon._id);
  if (projectsResult.isErr()) return err(projectsResult.error);
  const projects = projectsResult.value;

  return ok({
    hackathon,
    currentUser,
    projects,
  });
};

export const getProjectSubmissionData = query({
  args: {},
  handler: (ctx) => serializeResult(_getProjectSubmissionDataHandler(ctx)),
});
