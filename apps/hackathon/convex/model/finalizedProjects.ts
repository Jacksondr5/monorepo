import { QueryCtx } from "../_generated/server";
import { FinalizedProject, FinalizedProjectId } from "~/server/zod";
import { err, fromPromise, ok, Result } from "neverthrow";
import { getNotFoundError, NotFoundError, UnexpectedError } from "./error";

export type GetFinalizedProjectByIdError =
  | NotFoundError<"FINALIZED_PROJECT">
  | UnexpectedError;

export const getFinalizedProjectById = (
  ctx: QueryCtx,
  projectId: FinalizedProjectId,
): Promise<Result<FinalizedProject, GetFinalizedProjectByIdError>> => {
  return fromPromise(
    ctx.db.get(projectId),
    (originalError) => originalError,
  ).match(
    (project) => {
      if (!project) {
        return err(getNotFoundError("FINALIZED_PROJECT", projectId));
      }
      // TODO: remove after the migration
      return ok({
        ...project,
        comments: project.comments || [],
        interestedUsers: project.interestedUsers || [],
      });
    },
    (originalError) => {
      return err({
        type: "UNEXPECTED_ERROR",
        message: "There was an unexpected error getting the finalized project.",
        originalError,
      });
    },
  );
};
