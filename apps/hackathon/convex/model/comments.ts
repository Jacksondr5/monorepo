import { Comment, ProjectId, Upvote } from "~/server/zod";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { getCurrentUser, GetCurrentUserError } from "./users";
import { UpdateComment } from "~/server/zod";
import { getProjectById, GetProjectByIdError } from "./projects";
import { ok, err, Result } from "neverthrow";
import {
  fromPromiseUnexpectedError,
  getNotFoundError,
  NotFoundError,
  UnauthorizedError,
} from "./error";

export type GetCommentByIdError =
  | NotFoundError<"COMMENT">
  | GetProjectByIdError;

export type GetCommentByIdResult = {
  comment: Comment;
  commentIndex: number;
  comments: Comment[];
};

export const getCommentById = async (
  ctx: QueryCtx,
  projectId: ProjectId,
  commentId: string,
): Promise<Result<GetCommentByIdResult, GetCommentByIdError>> => {
  const projectResult = await getProjectById(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);

  const project = projectResult.value;
  const commentIndex = project.comments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) {
    return err(getNotFoundError("COMMENT", commentId));
  }

  const comment = project.comments[commentIndex];
  return ok({ comment, commentIndex, comments: project.comments });
};

export type UpdateCommentError =
  | GetCommentByIdError
  | GetCurrentUserError
  | UnauthorizedError;

export const updateComment = async (
  ctx: MutationCtx,
  projectId: ProjectId,
  commentId: string,
  newComment: Partial<UpdateComment>,
): Promise<Result<void, UpdateCommentError>> => {
  const result = await getCommentById(ctx, projectId, commentId);
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

  return fromPromiseUnexpectedError(
    ctx.db.patch(projectId, {
      comments: updatedComments,
    }),
  );
};

export const updateCommentUpvotes = async (
  ctx: MutationCtx,
  projectId: ProjectId,
  commentId: string,
  newUpvotes: Upvote[],
): Promise<Result<void, UpdateCommentError>> => {
  const result = await getCommentById(ctx, projectId, commentId);
  if (result.isErr()) return err(result.error);

  const { comment: existingComment, commentIndex, comments } = result.value;

  const updatedComment = { ...existingComment, upvotes: newUpvotes };
  const updatedComments = [...comments];
  updatedComments[commentIndex] = updatedComment;

  return fromPromiseUnexpectedError(
    ctx.db.patch(projectId, {
      comments: updatedComments,
    }),
    "Failed to update comment upvotes",
  );
};
