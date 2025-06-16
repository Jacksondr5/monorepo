import { Comment, FinalizedProjectId, Upvote } from "~/server/zod";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { getCurrentUser, GetCurrentUserError } from "./users";
import { UpdateComment } from "~/server/zod";
import {
  getFinalizedProjectById,
  GetFinalizedProjectByIdError,
} from "./finalizedProjects";
import { ok, err, Result } from "neverthrow";
import {
  fromPromiseUnexpectedError,
  getNotFoundError,
  NotFoundError,
  UnauthorizedError,
} from "./error";

export type GetCommentByIdOnFinalizedProjectError =
  | NotFoundError<"COMMENT">
  | GetFinalizedProjectByIdError;

export type GetCommentByIdOnFinalizedProjectResult = {
  comment: Comment;
  commentIndex: number;
  comments: Comment[];
};

export const getCommentByIdOnFinalizedProject = async (
  ctx: QueryCtx,
  projectId: FinalizedProjectId,
  commentId: string,
): Promise<
  Result<
    GetCommentByIdOnFinalizedProjectResult,
    GetCommentByIdOnFinalizedProjectError
  >
> => {
  const projectResult = await getFinalizedProjectById(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);

  const project = projectResult.value;
  const commentIndex = project.comments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) {
    return err(getNotFoundError("COMMENT", commentId));
  }

  const comment = project.comments[commentIndex];
  return ok({ comment, commentIndex, comments: project.comments });
};

export type UpdateCommentOnFinalizedProjectError =
  | GetCommentByIdOnFinalizedProjectError
  | GetCurrentUserError
  | UnauthorizedError;

export const updateCommentOnFinalizedProject = async (
  ctx: MutationCtx,
  projectId: FinalizedProjectId,
  commentId: string,
  newComment: Partial<UpdateComment>,
): Promise<Result<void, UpdateCommentOnFinalizedProjectError>> => {
  const result = await getCommentByIdOnFinalizedProject(
    ctx,
    projectId,
    commentId,
  );
  if (result.isErr()) return err(result.error);

  const { comment: existingComment, commentIndex, comments } = result.value;
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);

  const user = userResult.value;
  if (existingComment.authorId !== user._id) {
    return err({
      type: "UNAUTHORIZED",
      message: "You are not authorized to update this comment.",
    });
  }
  const updatedComment = { ...existingComment, ...newComment };
  const updatedComments = [...comments];
  updatedComments[commentIndex] = updatedComment;

  return await fromPromiseUnexpectedError(
    ctx.db.patch(projectId, {
      comments: updatedComments,
    }),
  );
};

export const updateCommentUpvotesOnFinalizedProject = async (
  ctx: MutationCtx,
  projectId: FinalizedProjectId,
  commentId: string,
  newUpvotes: Upvote[],
): Promise<Result<void, UpdateCommentOnFinalizedProjectError>> => {
  const result = await getCommentByIdOnFinalizedProject(
    ctx,
    projectId,
    commentId,
  );
  if (result.isErr()) return err(result.error);

  const { comment: existingComment, commentIndex, comments } = result.value;

  const updatedComment = { ...existingComment, upvotes: newUpvotes };
  const updatedComments = [...comments];
  updatedComments[commentIndex] = updatedComment;

  return fromPromiseUnexpectedError(
    ctx.db.patch(projectId, {
      comments: updatedComments,
    }),
    "Failed to update comment upvotes on finalized project",
  );
};
