import { z } from "zod";
import { mutation, query, MutationCtx } from "./_generated/server";
import { v4 as uuidv4 } from "uuid";
import {
  CreateFinalizedProjectSchema,
  FinalizedProjectId,
  FinalizedProjectIdSchema,
  UpdateFinalizedProjectSchema,
} from "../src/server/zod/finalized-project";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { getCurrentUser, GetCurrentUserError } from "./model/users";
import { HackathonEventIdSchema } from "~/server/zod";
import {
  getCommentByIdOnFinalizedProject,
  updateCommentOnFinalizedProject,
  GetCommentByIdOnFinalizedProjectError,
  UpdateCommentOnFinalizedProjectError,
  updateCommentUpvotesOnFinalizedProject,
} from "./model/finalizedProjectComments";
import {
  getFinalizedProjectById,
  GetFinalizedProjectByIdError,
  getFinalizedProjectsByHackathonEvent as modelGetFinalizedProjectsByHackathonEvent,
} from "./model/finalizedProjects";
import {
  fromPromiseUnexpectedError,
  UnexpectedError,
  NotFoundError,
  getNotFoundError,
  UnauthorizedError,
  DataIsUnexpectedShapeError,
  serializeResult,
} from "./model/error";
import { err, ok, Result } from "neverthrow";

const finalizedProjectQuery = zCustomQuery(query, NoOp);
const finalizedProjectMutation = zCustomMutation(mutation, NoOp);

const CommentTargetArgsSchema = z.object({
  commentId: z.string(),
  projectId: FinalizedProjectIdSchema,
});

const ProjectTargetArgsSchema = z.object({
  projectId: FinalizedProjectIdSchema,
});

const AddCommentSchema = z.object({
  projectId: FinalizedProjectIdSchema,
  text: z.string().trim().min(1, "Comment cannot be empty."),
});

const UpdateCommentSchema = z.object({
  commentId: z.string(),
  projectId: FinalizedProjectIdSchema,
  text: z.string().trim().min(1, "Comment cannot be empty."),
});

export type CreateFinalizedProjectError =
  | GetCurrentUserError
  | UnauthorizedError
  | UnexpectedError;

export type UpdateFinalizedProjectError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnauthorizedError
  | UnexpectedError;

export type DeleteFinalizedProjectError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnauthorizedError
  | UnexpectedError;

export type AddCommentToFinalizedProjectError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnexpectedError;

export type DeleteCommentFromFinalizedProjectError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | NotFoundError<"COMMENT">
  | UnauthorizedError
  | UnexpectedError;

export type AddInterestedUserError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnexpectedError;

export type RemoveInterestedUserError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnexpectedError;

export type UpvoteCommentOnFinalizedProjectError =
  | GetCurrentUserError
  | GetCommentByIdOnFinalizedProjectError
  | UpdateCommentOnFinalizedProjectError;

export type RemoveUpvoteFromCommentOnFinalizedProjectError =
  | GetCurrentUserError
  | GetCommentByIdOnFinalizedProjectError
  | UpdateCommentOnFinalizedProjectError;

export type GetFinalizedProjectsByHackathonEventError =
  | UnexpectedError
  | DataIsUnexpectedShapeError;

// --- Mutations ---
const _createFinalizedProjectHandler = async (
  ctx: MutationCtx,
  { data }: { data: z.infer<typeof CreateFinalizedProjectSchema> },
): Promise<Result<FinalizedProjectId, CreateFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  // Only admins can create finalized projects
  if (user.role !== "ADMIN") {
    return err({
      type: "UNAUTHORIZED",
      message: "Only admins can create finalized projects.",
    } satisfies UnauthorizedError);
  }

  const projectIdResult = await fromPromiseUnexpectedError(
    ctx.db.insert("finalizedProjects", {
      ...data,
      // Ensure new fields from schema are initialized
      comments: [],
      interestedUsers: [],
      updatedAt: Date.now(),
    }),
  );
  return projectIdResult;
};

export const createFinalizedProject = finalizedProjectMutation({
  args: { data: CreateFinalizedProjectSchema },
  handler: (ctx, args) =>
    serializeResult(_createFinalizedProjectHandler(ctx, args)),
});

const _updateFinalizedProjectHandler = async (
  ctx: MutationCtx,
  {
    id,
    values,
  }: {
    id: FinalizedProjectId;
    values: z.infer<typeof UpdateFinalizedProjectSchema>;
  },
): Promise<Result<void, UpdateFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  // Only admins can update finalized projects
  if (user.role !== "ADMIN") {
    return err({
      type: "UNAUTHORIZED",
      message: "Only admins can update finalized projects.",
    } satisfies UnauthorizedError);
  }

  const projectResult = await getFinalizedProjectById(ctx, id);
  if (projectResult.isErr()) return err(projectResult.error);

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(id, {
      ...values,
      updatedAt: Date.now(),
    }),
    "Failed to patch finalized project",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const updateFinalizedProject = finalizedProjectMutation({
  args: {
    id: FinalizedProjectIdSchema,
    values: UpdateFinalizedProjectSchema,
  },
  handler: (ctx, args) =>
    serializeResult(_updateFinalizedProjectHandler(ctx, args)),
});

const _deleteFinalizedProjectHandler = async (
  ctx: MutationCtx,
  { id }: { id: FinalizedProjectId },
): Promise<Result<void, DeleteFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  // Only admins can delete finalized projects
  if (user.role !== "ADMIN") {
    return err({
      type: "UNAUTHORIZED",
      message: "Only admins can delete finalized projects.",
    } satisfies UnauthorizedError);
  }

  const projectResult = await getFinalizedProjectById(ctx, id);
  if (projectResult.isErr()) return err(projectResult.error);

  const deleteResult = await fromPromiseUnexpectedError(
    ctx.db.delete(id),
    "Failed to delete finalized project",
  );
  if (deleteResult.isErr()) return err(deleteResult.error);

  return ok();
};

export const deleteFinalizedProject = finalizedProjectMutation({
  args: { id: FinalizedProjectIdSchema },
  handler: (ctx, args) =>
    serializeResult(_deleteFinalizedProjectHandler(ctx, args)),
});

const _addCommentToFinalizedProjectHandler = async (
  ctx: MutationCtx,
  { projectId, text }: z.infer<typeof AddCommentSchema>,
): Promise<Result<void, AddCommentToFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const projectResult = await getFinalizedProjectById(ctx, projectId);
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
    "Failed to add comment to finalized project",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const addCommentToFinalizedProject = finalizedProjectMutation({
  args: AddCommentSchema,
  handler: (ctx, args) =>
    serializeResult(_addCommentToFinalizedProjectHandler(ctx, args)),
});

const _updateCommentOnFinalizedProjectHandler = async (
  ctx: MutationCtx,
  { projectId, commentId, text }: z.infer<typeof UpdateCommentSchema>,
): Promise<Result<void, UpdateCommentOnFinalizedProjectError>> => {
  return updateCommentOnFinalizedProject(ctx, projectId, commentId, { text });
};

export const updateCommentOnFinalizedProjectMutation = finalizedProjectMutation(
  {
    args: UpdateCommentSchema,
    handler: (ctx, args) =>
      serializeResult(_updateCommentOnFinalizedProjectHandler(ctx, args)),
  },
);

const _deleteCommentFromFinalizedProjectHandler = async (
  ctx: MutationCtx,
  { projectId, commentId }: z.infer<typeof CommentTargetArgsSchema>,
): Promise<Result<void, DeleteCommentFromFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const projectResult = await getFinalizedProjectById(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);
  const project = projectResult.value;

  const comment = project.comments.find((c) => c.id === commentId);
  if (!comment) {
    return err(getNotFoundError("COMMENT", commentId));
  }

  if (comment.authorId !== user._id && user.role !== "ADMIN") {
    return err({
      type: "UNAUTHORIZED",
      message:
        "Unauthorized to delete this comment. Must be comment author or admin.",
    } satisfies UnauthorizedError);
  }

  const updatedComments = project.comments.filter((c) => c.id !== commentId);

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(project._id, {
      comments: updatedComments,
    }),
    "Failed to delete comment from finalized project",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const deleteCommentFromFinalizedProject = finalizedProjectMutation({
  args: CommentTargetArgsSchema,
  handler: (ctx, args) =>
    serializeResult(_deleteCommentFromFinalizedProjectHandler(ctx, args)),
});

const _addInterestedUserHandler = async (
  ctx: MutationCtx,
  { projectId }: z.infer<typeof ProjectTargetArgsSchema>,
): Promise<Result<void, AddInterestedUserError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const projectResult = await getFinalizedProjectById(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);
  const project = projectResult.value;

  const existingInterest = project.interestedUsers.find(
    (interestedUser) => interestedUser.userId === user._id,
  );
  if (existingInterest) return ok();

  const newInterestedUser = {
    createdAt: Date.now(),
    userId: user._id,
  };

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(project._id, {
      interestedUsers: [...project.interestedUsers, newInterestedUser],
      updatedAt: Date.now(),
    }),
    "Failed to add interested user to finalized project",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const addInterestedUser = finalizedProjectMutation({
  args: ProjectTargetArgsSchema,
  handler: (ctx, args) => serializeResult(_addInterestedUserHandler(ctx, args)),
});

const _removeInterestedUserHandler = async (
  ctx: MutationCtx,
  { projectId }: z.infer<typeof ProjectTargetArgsSchema>,
): Promise<Result<void, RemoveInterestedUserError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const projectResult = await getFinalizedProjectById(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);
  const project = projectResult.value;

  const initialInterestedUsersCount = project.interestedUsers.length;
  const updatedInterestedUsers = project.interestedUsers.filter(
    (interestedUser) => interestedUser.userId !== user._id,
  );

  if (updatedInterestedUsers.length === initialInterestedUsersCount)
    return ok();

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(project._id, {
      interestedUsers: updatedInterestedUsers,
      updatedAt: Date.now(),
    }),
    "Failed to remove interested user from finalized project",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const removeInterestedUser = finalizedProjectMutation({
  args: ProjectTargetArgsSchema,
  handler: (ctx, args) =>
    serializeResult(_removeInterestedUserHandler(ctx, args)),
});

const _upvoteCommentOnFinalizedProjectHandler = async (
  ctx: MutationCtx,
  { projectId, commentId }: z.infer<typeof CommentTargetArgsSchema>,
): Promise<Result<void, UpvoteCommentOnFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const commentResult = await getCommentByIdOnFinalizedProject(
    ctx,
    projectId,
    commentId,
  );
  if (commentResult.isErr()) return err(commentResult.error);
  const { comment } = commentResult.value;

  const existingUpvote = comment.upvotes.find(
    (upvote) => upvote.userId === user._id,
  );

  if (existingUpvote) return ok(); // Already upvoted

  const newUpvote = { createdAt: Date.now(), userId: user._id };
  const updatedCommentUpvotes = [...comment.upvotes, newUpvote];
  return updateCommentUpvotesOnFinalizedProject(
    ctx,
    projectId,
    commentId,
    updatedCommentUpvotes,
  );
};

export const upvoteCommentOnFinalizedProject = finalizedProjectMutation({
  args: CommentTargetArgsSchema,
  handler: (ctx, args) =>
    serializeResult(_upvoteCommentOnFinalizedProjectHandler(ctx, args)),
});

const _removeUpvoteFromCommentOnFinalizedProjectHandler = async (
  ctx: MutationCtx,
  { projectId, commentId }: z.infer<typeof CommentTargetArgsSchema>,
): Promise<Result<void, RemoveUpvoteFromCommentOnFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const commentResult = await getCommentByIdOnFinalizedProject(
    ctx,
    projectId,
    commentId,
  );
  if (commentResult.isErr()) return err(commentResult.error);
  const { comment } = commentResult.value;

  const existingUpvote = comment.upvotes.find(
    (upvote) => upvote.userId === user._id,
  );

  if (!existingUpvote) return ok(); // Not upvoted

  const updatedCommentUpvotes = comment.upvotes.filter(
    (upvote) => upvote.userId !== user._id,
  );

  return updateCommentUpvotesOnFinalizedProject(
    ctx,
    projectId,
    commentId,
    updatedCommentUpvotes,
  );
};

export const removeUpvoteFromCommentOnFinalizedProject =
  finalizedProjectMutation({
    args: CommentTargetArgsSchema,
    handler: (ctx, args) =>
      serializeResult(
        _removeUpvoteFromCommentOnFinalizedProjectHandler(ctx, args),
      ),
  });

// --- Queries ---
export const getFinalizedProjectsByHackathonEvent = finalizedProjectQuery({
  args: { hackathonEventId: HackathonEventIdSchema },
  handler: (ctx, { hackathonEventId }) =>
    serializeResult(
      modelGetFinalizedProjectsByHackathonEvent(ctx, hackathonEventId),
    ),
});
