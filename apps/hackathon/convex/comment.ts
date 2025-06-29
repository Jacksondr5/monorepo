import {
  AddCommentSchema,
  ToggleUpvoteOnCommentSchema,
  DeleteCommentSchema,
  FinalizedProject,
  Project,
} from "~/server/zod";
import { Result, err, ok } from "neverthrow";
import z from "zod";
import { mutation, MutationCtx } from "./_generated/server";
import {
  fromPromiseUnexpectedError,
  getNotFoundError,
  NotFoundError,
  serializeResult,
  UnauthorizedError,
  UnexpectedError,
} from "./model/error";
import {
  getFinalizedProjectById,
  GetFinalizedProjectByIdError,
} from "./model/finalizedProjects";
import { getCurrentUser, GetCurrentUserError } from "./model/users";
import { v4 as uuidv4 } from "uuid";
import { zCustomMutation } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { Id } from "./_generated/dataModel";
import { getProjectById, GetProjectByIdError } from "./model/projects";

const commentMutation = zCustomMutation(mutation, NoOp);

const isFinalizedProjectId = (
  id: Id<"projects"> | Id<"finalizedProjects">,
): id is Id<"finalizedProjects"> => {
  // Convex IDs include a __tableName property for type discrimination
  return id.__tableName === "finalizedProjects";
};

const getProject = async (
  ctx: MutationCtx,
  projectId: Id<"projects"> | Id<"finalizedProjects"> | string,
): Promise<
  | Result<Project, GetProjectByIdError>
  | Result<FinalizedProject, GetFinalizedProjectByIdError>
> => {
  if (isFinalizedProjectId(projectId as Id<"finalizedProjects">)) {
    return getFinalizedProjectById(ctx, projectId as Id<"finalizedProjects">);
  }
  return getProjectById(ctx, projectId as Id<"projects">);
};

export type AddCommentError =
  | GetCurrentUserError
  | UnexpectedError
  | GetFinalizedProjectByIdError
  | GetProjectByIdError;

const _addCommentHandler = async (
  ctx: MutationCtx,
  { projectId, text }: z.infer<typeof AddCommentSchema>,
): Promise<Result<void, AddCommentError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const projectResult = await getProject(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);
  const project = projectResult.value;

  const newComment = {
    authorId: user._id,
    createdAt: Date.now(),
    id: uuidv4(),
    text,
    upvotes: [],
  };

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(project._id, {
      comments: [...project.comments, newComment],
    }),
    "Failed to add comment",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const addComment = commentMutation({
  args: AddCommentSchema,
  handler: (ctx, args) => serializeResult(_addCommentHandler(ctx, args)),
});

export type ToggleUpvoteOnCommentError =
  | GetCurrentUserError
  | UnexpectedError
  | GetFinalizedProjectByIdError
  | GetProjectByIdError
  | NotFoundError<"COMMENT">;

const _toggleUpvoteOnCommentHandler = async (
  ctx: MutationCtx,
  { projectId, commentId }: z.infer<typeof ToggleUpvoteOnCommentSchema>,
): Promise<Result<void, ToggleUpvoteOnCommentError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const projectResult = await getProject(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);
  const project = projectResult.value;

  const commentIndex = project.comments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) {
    return err(getNotFoundError("COMMENT", commentId));
  }

  const comment = project.comments[commentIndex];
  const existingUpvoteIndex = comment.upvotes.findIndex(
    (upvote) => upvote.userId === user._id,
  );

  let updatedUpvotes;
  if (existingUpvoteIndex >= 0) {
    // Remove upvote
    updatedUpvotes = comment.upvotes.filter(
      (upvote) => upvote.userId !== user._id,
    );
  } else {
    // Add upvote
    updatedUpvotes = [
      ...comment.upvotes,
      {
        userId: user._id,
        createdAt: Date.now(),
      },
    ];
  }

  const updatedComments = [...project.comments];
  updatedComments[commentIndex] = {
    ...comment,
    upvotes: updatedUpvotes,
  };

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(project._id, {
      comments: updatedComments,
    }),
    "Failed to toggle upvote on comment",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const toggleUpvoteOnComment = commentMutation({
  args: ToggleUpvoteOnCommentSchema,
  handler: (ctx, args) =>
    serializeResult(_toggleUpvoteOnCommentHandler(ctx, args)),
});

export type DeleteCommentError =
  | GetCurrentUserError
  | UnexpectedError
  | GetFinalizedProjectByIdError
  | GetProjectByIdError
  | NotFoundError<"COMMENT">
  | UnauthorizedError;

const _deleteCommentHandler = async (
  ctx: MutationCtx,
  { projectId, commentId }: z.infer<typeof DeleteCommentSchema>,
): Promise<Result<void, DeleteCommentError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const projectResult = await getProject(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);
  const project = projectResult.value;

  const commentIndex = project.comments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) {
    return err(getNotFoundError("COMMENT", commentId));
  }

  const comment = project.comments[commentIndex];

  // Only allow the comment author to delete their own comment
  if (comment.authorId !== user._id) {
    return err({
      type: "UNAUTHORIZED",
      message: "Only the comment author can delete their own comment.",
    } satisfies UnauthorizedError);
  }

  const updatedComments = project.comments.filter((c) => c.id !== commentId);

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(project._id, {
      comments: updatedComments,
    }),
    "Failed to delete comment",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const deleteComment = commentMutation({
  args: DeleteCommentSchema,
  handler: (ctx, args) => serializeResult(_deleteCommentHandler(ctx, args)),
});
