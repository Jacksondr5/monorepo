import { QueryCtx } from "../_generated/server";
import { Project, ProjectId } from "~/server/zod";
import { err, fromPromise, ok, Result } from "neverthrow";
import { getNotFoundError, NotFoundError, UnexpectedError } from "./error";

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
      // TODO: remove after the migration
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
