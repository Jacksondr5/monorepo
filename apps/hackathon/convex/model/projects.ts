import { QueryCtx } from "../_generated/server";
import {
  Project,
  ProjectId,
  HackathonEventIdSchema,
  ZodUserId,
} from "~/server/zod";
import { err, fromPromise, ok, Result } from "neverthrow";
import {
  getNotFoundError,
  NotFoundError,
  UnexpectedError,
  DataIsUnexpectedShapeError,
  safeParseConvexObject,
  fromPromiseUnexpectedError,
} from "./error";
import { ProjectListSchema } from "~/server/zod/views/project-list";
import { z } from "zod";

export type GetProjectByIdError = NotFoundError<"PROJECT"> | UnexpectedError;

export const getProjectById = (
  ctx: QueryCtx,
  projectId: ProjectId,
): Promise<Result<Project, GetProjectByIdError>> => {
  return fromPromise(
    ctx.db.get(projectId),
    (originalError) => originalError,
  ).match(
    (project) => {
      if (!project) {
        return err(getNotFoundError("PROJECT", projectId));
      }
      // TODO: remove after the migration (JAC-77)
      return ok({
        ...project,
        comments: project.comments || [],
        upvotes: project.upvotes || [],
      });
    },
    (originalError) => {
      return err({
        type: "UNEXPECTED_ERROR",
        message: "There was an unexpected error getting the project.",
        originalError,
      });
    },
  );
};

export type GetProjectsByHackathonEventError =
  | UnexpectedError
  | DataIsUnexpectedShapeError;

export const getProjectsByHackathonEvent = async (
  ctx: QueryCtx,
  hackathonEventId: z.infer<typeof HackathonEventIdSchema>,
): Promise<
  Result<z.infer<typeof ProjectListSchema>, GetProjectsByHackathonEventError>
> => {
  const projectsResult = await fromPromiseUnexpectedError(
    ctx.db
      .query("projects")
      .withIndex("by_hackathon_event", (q) =>
        q.eq("hackathonEventId", hackathonEventId),
      )
      .collect(),
    "Failed to query projects by hackathon event id",
  );

  if (projectsResult.isErr()) return err(projectsResult.error);

  const projects = projectsResult.value
    // TODO: remove after migration (JAC-77)
    .map((project) => ({
      ...project,
      comments: project.comments || [],
      upvotes: project.upvotes || [],
    }));

  const userIds = new Set<ZodUserId>();
  projects.forEach((project) => {
    userIds.add(project.creatorUserId);
    // TODO: remove after migration (JAC-77)
    if (project.comments) {
      project.comments.forEach((comment) => {
        userIds.add(comment.authorId);
        comment.upvotes.forEach((upvote) => {
          userIds.add(upvote.userId);
        });
      });
    }
    if (project.upvotes) {
      project.upvotes.forEach((upvote) => {
        userIds.add(upvote.userId);
      });
    }
  });
  const usersResult = await fromPromiseUnexpectedError(
    // The AI might complain that this is inefficient, but Convex says to do this:
    // https://stack.convex.dev/complex-filters-in-convex#optimize-with-indexes
    Promise.all(Array.from(userIds).map((userId) => ctx.db.get(userId))),
    "Failed to get users for projects",
  );

  if (usersResult.isErr()) return err(usersResult.error);
  const users = usersResult.value.filter((user) => user !== null);

  return safeParseConvexObject(ProjectListSchema, {
    projects,
    visibleUsers: users,
  });
};
