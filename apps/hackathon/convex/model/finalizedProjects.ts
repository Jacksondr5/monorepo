import { QueryCtx } from "../_generated/server";
import { FinalizedProject, FinalizedProjectId } from "~/server/zod";
import { err, ok, Result } from "neverthrow";
import {
  fromPromiseUnexpectedError,
  getNotFoundError,
  NotFoundError,
  UnexpectedError,
} from "./error";

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
  });
};
