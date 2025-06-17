import { QueryCtx } from "../_generated/server";
import {
  FinalizedProject,
  FinalizedProjectId,
  FinalizedProjectListSchema,
  HackathonEventIdSchema,
  ZodUser,
  ZodUserId,
} from "~/server/zod";
import { err, ok, Result } from "neverthrow";
import {
  fromPromiseUnexpectedError,
  getNotFoundError,
  NotFoundError,
  UnexpectedError,
  DataIsUnexpectedShapeError,
  safeParseConvexObject,
} from "./error";
import { z } from "zod";

export type GetFinalizedProjectByIdError =
  | NotFoundError<"FINALIZED_PROJECT">
  | UnexpectedError;

export const getFinalizedProjectById = async (
  ctx: QueryCtx,
  projectId: FinalizedProjectId,
): Promise<Result<FinalizedProject, GetFinalizedProjectByIdError>> => {
  const result = await fromPromiseUnexpectedError(
    ctx.db.get(projectId),
    "There was an unexpected error getting the finalized project.",
  );
  if (result.isErr()) {
    return err(result.error);
  }
  if (!result.value) {
    return err(getNotFoundError("FINALIZED_PROJECT", projectId));
  }
  return ok({
    ...result.value,
    comments: result.value.comments || [],
    interestedUsers: result.value.interestedUsers || [],
    assignedUsers: result.value.assignedUsers || [],
  });
};

// Define the FinalizedProjectList type
type FinalizedProjectList = {
  projects: FinalizedProject[];
  visibleUsers: ZodUser[];
};

export type GetFinalizedProjectsByHackathonEventError =
  | UnexpectedError
  | DataIsUnexpectedShapeError;

export const getFinalizedProjectsByHackathonEvent = async (
  ctx: QueryCtx,
  hackathonEventId: z.infer<typeof HackathonEventIdSchema>,
): Promise<
  Result<FinalizedProjectList, GetFinalizedProjectsByHackathonEventError>
> => {
  const projectsResult = await fromPromiseUnexpectedError(
    ctx.db
      .query("finalizedProjects")
      .withIndex("by_hackathon_event", (q) =>
        q.eq("hackathonEventId", hackathonEventId),
      )
      .collect(),
    "Failed to query finalized projects by hackathon event id",
  );

  if (projectsResult.isErr()) return err(projectsResult.error);

  const projects = projectsResult.value;

  const userIds = new Set<ZodUserId>();
  projects.forEach((project) => {
    project.comments.forEach((comment) => {
      userIds.add(comment.authorId);
      comment.upvotes.forEach((upvote) => {
        userIds.add(upvote.userId);
      });
    });
    project.interestedUsers.forEach((interestedUser) => {
      userIds.add(interestedUser.userId);
    });
    (project.assignedUsers || []).forEach((assignedUser) => {
      userIds.add(assignedUser.userId);
    });
  });

  const usersResult = await fromPromiseUnexpectedError(
    Promise.all(Array.from(userIds).map((userId) => ctx.db.get(userId))),
    "Failed to get users for finalized projects",
  );

  if (usersResult.isErr()) return err(usersResult.error);
  const users = usersResult.value.filter((user) => user !== null);

  return safeParseConvexObject(FinalizedProjectListSchema, {
    projects,
    visibleUsers: users,
  });
};
