import { z } from "zod";
import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { v4 as uuidv4 } from "uuid";
import {
  CreateProjectSchema,
  ProjectId,
  ProjectIdSchema,
  UpdateProjectSchema,
} from "../src/server/zod/project";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { getCurrentUser, GetCurrentUserError } from "./model/users";
import { HackathonEventIdSchema, ZodUserId } from "~/server/zod";
import {
  getCommentById,
  updateComment,
  GetCommentByIdError,
  UpdateCommentError,
} from "./model/comments";
import { getProjectById, GetProjectByIdError } from "./model/projects";
import { ProjectListSchema } from "~/server/zod/views/project-list";
import {
  fromPromiseUnexpectedError,
  UnexpectedError,
  NotFoundError,
  getNotFoundError,
  UnauthorizedError,
  DataIsUnexpectedShapeError,
  safeParseConvexObject,
  serializeResult,
} from "./model/error";
import { err, ok, Result } from "neverthrow";

const projectQuery = zCustomQuery(query, NoOp);
const projectMutation = zCustomMutation(mutation, NoOp);

const CommentTargetArgsSchema = z.object({
  commentId: z.string(),
  projectId: ProjectIdSchema,
});

const ProjectTargetArgsSchema = z.object({
  projectId: ProjectIdSchema,
});

const AddCommentSchema = z.object({
  projectId: ProjectIdSchema,
  text: z.string().min(1, "Comment cannot be empty."),
});

const UpdateCommentSchema = z.object({
  commentId: z.string(),
  projectId: ProjectIdSchema,
  text: z.string().min(1, "Comment cannot be empty."),
});

export type CreateProjectError = GetCurrentUserError | UnexpectedError;

export type UpdateProjectError =
  | GetCurrentUserError
  | GetProjectByIdError
  | UnauthorizedError
  | UnexpectedError;

export type DeleteProjectError =
  | GetCurrentUserError
  | GetProjectByIdError
  | UnauthorizedError
  | UnexpectedError;

export type AddCommentToProjectError =
  | GetCurrentUserError
  | GetProjectByIdError
  | UnexpectedError;

export type UpdateCommentOnProjectError = UpdateCommentError;

export type DeleteCommentError =
  | GetCurrentUserError
  | GetProjectByIdError
  | NotFoundError<"COMMENT">
  | UnauthorizedError
  | UnexpectedError;

export type UpvoteProjectError =
  | GetCurrentUserError
  | GetProjectByIdError
  | UnexpectedError;

export type RemoveUpvoteFromProjectError =
  | GetCurrentUserError
  | GetProjectByIdError
  | UnexpectedError;

export type UpvoteCommentError =
  | GetCurrentUserError
  | GetCommentByIdError
  | UpdateCommentError;

export type RemoveUpvoteFromCommentError =
  | GetCurrentUserError
  | GetCommentByIdError
  | UpdateCommentError;

export type GetProjectsByHackathonEventError =
  | UnexpectedError
  | DataIsUnexpectedShapeError;

// --- Mutations ---
const _createProjectHandler = async (
  ctx: MutationCtx,
  { data }: { data: z.infer<typeof CreateProjectSchema> },
): Promise<Result<ProjectId, CreateProjectError>> => {
    const userResult = await getCurrentUser(ctx);
    if (userResult.isErr()) return err(userResult.error);
    const projectIdResult = await fromPromiseUnexpectedError(
      ctx.db.insert("projects", {
        ...data,
        // Ensure new fields from schema are initialized
        comments: [],
        creatorUserId: userResult.value._id,
        updatedAt: Date.now(),
        upvotes: [],
      }),
    );
    return projectIdResult;
};

export const createProject = projectMutation({
  args: { data: CreateProjectSchema },
  handler: (ctx, args) => serializeResult(_createProjectHandler(ctx, args)),
});

const _updateProjectHandler = async (
  ctx: MutationCtx,
  { id, values }: { id: ProjectId; values: z.infer<typeof UpdateProjectSchema> },
): Promise<Result<void, UpdateProjectError>> => {
    const userResult = await getCurrentUser(ctx);
    if (userResult.isErr()) return err(userResult.error);
    const user = userResult.value;

    const projectResult = await getProjectById(ctx, id);
    if (projectResult.isErr()) return err(projectResult.error);
    const project = projectResult.value;

    if (project.creatorUserId !== user._id) {
      return err({
        type: "UNAUTHORIZED",
        message: "Unauthorized to update this project.",
      } satisfies UnauthorizedError);
    }

    const patchResult = await fromPromiseUnexpectedError(
      ctx.db.patch(id, {
        ...values,
        updatedAt: Date.now(),
      }),
      "Failed to patch project",
    );
    if (patchResult.isErr()) return err(patchResult.error);

    return ok();
};

export const updateProject = projectMutation({
  args: {
    id: ProjectIdSchema,
    values: UpdateProjectSchema,
  },
  handler: (ctx, args) => serializeResult(_updateProjectHandler(ctx, args)),
});

const _deleteProjectHandler = async (
  ctx: MutationCtx,
  { id }: { id: ProjectId },
): Promise<Result<void, DeleteProjectError>> => {
    const userResult = await getCurrentUser(ctx);
    if (userResult.isErr()) return err(userResult.error);
    const user = userResult.value;

    const projectResult = await getProjectById(ctx, id);
    if (projectResult.isErr()) return err(projectResult.error);
    const project = projectResult.value;

    if (project.creatorUserId !== user._id) {
      return err({
        type: "UNAUTHORIZED",
        message: "Unauthorized to delete this project.",
      } satisfies UnauthorizedError);
    }

    const deleteResult = await fromPromiseUnexpectedError(
      ctx.db.delete(id),
      "Failed to delete project",
    );
    if (deleteResult.isErr()) return err(deleteResult.error);

    return ok();
};

export const deleteProject = projectMutation({
  args: { id: ProjectIdSchema },
  handler: (ctx, args) => serializeResult(_deleteProjectHandler(ctx, args)),
});

const _addCommentToProjectHandler = async (
  ctx: MutationCtx,
  { projectId, text }: z.infer<typeof AddCommentSchema>,
): Promise<Result<void, AddCommentToProjectError>> => {
    const userResult = await getCurrentUser(ctx);
    if (userResult.isErr()) return err(userResult.error);
    const user = userResult.value;

    const projectResult = await getProjectById(ctx, projectId);
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
      "Failed to add comment to project",
    );
    if (patchResult.isErr()) return err(patchResult.error);

    return ok();
};

export const addCommentToProject = projectMutation({
  args: AddCommentSchema,
  handler: (ctx, args) => serializeResult(_addCommentToProjectHandler(ctx, args)),
});

const _updateCommentOnProjectHandler = async (
  ctx: MutationCtx,
  { projectId, commentId, text }: z.infer<typeof UpdateCommentSchema>,
): Promise<Result<void, UpdateCommentOnProjectError>> => {
    return updateComment(ctx, projectId, commentId, { text });
};

export const updateCommentOnProject = projectMutation({
  args: UpdateCommentSchema,
  handler: (ctx, args) => serializeResult(_updateCommentOnProjectHandler(ctx, args)),
});

const _deleteCommentHandler = async (
  ctx: MutationCtx,
  { projectId, commentId }: z.infer<typeof CommentTargetArgsSchema>,
): Promise<Result<void, DeleteCommentError>> => {
    const userResult = await getCurrentUser(ctx);
    if (userResult.isErr()) return err(userResult.error);
    const user = userResult.value;

    const projectResult = await getProjectById(ctx, projectId);
    if (projectResult.isErr()) return err(projectResult.error);
    const project = projectResult.value;

    const comment = project.comments.find((c) => c.id === commentId);
    if (!comment) {
      return err(getNotFoundError("COMMENT", commentId));
    }

    if (comment.authorId !== user._id && project.creatorUserId !== user._id) {
      return err({
        type: "UNAUTHORIZED",
        message:
          "Unauthorized to delete this comment. Must be comment author or project creator.",
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

export const deleteComment = projectMutation({
  args: CommentTargetArgsSchema,
  handler: (ctx, args) => serializeResult(_deleteCommentHandler(ctx, args)),
});

const _upvoteProjectHandler = async (
  ctx: MutationCtx,
  { projectId }: z.infer<typeof ProjectTargetArgsSchema>,
): Promise<Result<void, UpvoteProjectError>> => {
    const userResult = await getCurrentUser(ctx);
    if (userResult.isErr()) return err(userResult.error);
    const user = userResult.value;

    const projectResult = await getProjectById(ctx, projectId);
    if (projectResult.isErr()) return err(projectResult.error);
    const project = projectResult.value;

    const existingUpvote = project.upvotes.find(
      (upvote) => upvote.userId === user._id,
    );
    if (existingUpvote) return ok();

    const newUpvote = {
      createdAt: Date.now(),
      userId: user._id,
    };

    const patchResult = await fromPromiseUnexpectedError(
      ctx.db.patch(project._id, {
        upvotes: [...project.upvotes, newUpvote],
        updatedAt: Date.now(),
      }),
      "Failed to upvote project",
    );
    if (patchResult.isErr()) return err(patchResult.error);

    return ok();
};

export const upvoteProject = projectMutation({
  args: ProjectTargetArgsSchema,
  handler: (ctx, args) => serializeResult(_upvoteProjectHandler(ctx, args)),
});

const _removeUpvoteFromProjectHandler = async (
  ctx: MutationCtx,
  { projectId }: z.infer<typeof ProjectTargetArgsSchema>,
): Promise<Result<void, RemoveUpvoteFromProjectError>> => {
    const userResult = await getCurrentUser(ctx);
    if (userResult.isErr()) return err(userResult.error);
    const user = userResult.value;

    const projectResult = await getProjectById(ctx, projectId);
    if (projectResult.isErr()) return err(projectResult.error);
    const project = projectResult.value;

    const initialUpvotesCount = project.upvotes.length;
    const updatedUpvotes = project.upvotes.filter(
      (upvote) => upvote.userId !== user._id,
    );

    if (updatedUpvotes.length === initialUpvotesCount) return ok();

    const patchResult = await fromPromiseUnexpectedError(
      ctx.db.patch(project._id, {
        upvotes: updatedUpvotes,
        updatedAt: Date.now(),
      }),
      "Failed to remove upvote from project",
    );
    if (patchResult.isErr()) return err(patchResult.error);

    return ok();
};

export const removeUpvoteFromProject = projectMutation({
  args: ProjectTargetArgsSchema,
  handler: (ctx, args) => serializeResult(_removeUpvoteFromProjectHandler(ctx, args)),
});

const _upvoteCommentHandler = async (
  ctx: MutationCtx,
  { projectId, commentId }: z.infer<typeof CommentTargetArgsSchema>,
): Promise<Result<void, UpvoteCommentError>> => {
    const userResult = await getCurrentUser(ctx);
    if (userResult.isErr()) return err(userResult.error);
    const user = userResult.value;

    const commentResult = await getCommentById(ctx, projectId, commentId);
    if (commentResult.isErr()) return err(commentResult.error);
    const { comment } = commentResult.value;

    const existingUpvote = comment.upvotes.find(
      (upvote) => upvote.userId === user._id,
    );

    if (existingUpvote) return ok(); // Already upvoted

    const newUpvote = { createdAt: Date.now(), userId: user._id };
    const updatedCommentUpvotes = [...comment.upvotes, newUpvote];
    const updatedCommentData = {
      ...comment,
      upvotes: updatedCommentUpvotes,
    };

    return updateComment(ctx, projectId, commentId, updatedCommentData);
};

export const upvoteComment = projectMutation({
  args: CommentTargetArgsSchema,
  handler: (ctx, args) => serializeResult(_upvoteCommentHandler(ctx, args)),
});

const _removeUpvoteFromCommentHandler = async (
  ctx: MutationCtx,
  { projectId, commentId }: z.infer<typeof CommentTargetArgsSchema>,
): Promise<Result<void, RemoveUpvoteFromCommentError>> => {
    const userResult = await getCurrentUser(ctx);
    if (userResult.isErr()) return err(userResult.error);
    const user = userResult.value;

    const commentResult = await getCommentById(ctx, projectId, commentId);
    if (commentResult.isErr()) return err(commentResult.error);
    const { comment } = commentResult.value;

    const existingUpvote = comment.upvotes.find(
      (upvote) => upvote.userId === user._id,
    );

    if (!existingUpvote) return ok(); // Not upvoted

    const updatedCommentUpvotes = comment.upvotes.filter(
      (upvote) => upvote.userId !== user._id,
    );
    const updatedCommentData = {
      ...comment,
      upvotes: updatedCommentUpvotes,
    };

    return updateComment(ctx, projectId, commentId, updatedCommentData);
};

export const removeUpvoteFromComment = projectMutation({
  args: CommentTargetArgsSchema,
  handler: (ctx, args) => serializeResult(_removeUpvoteFromCommentHandler(ctx, args)),
});

// --- Queries ---
const _getProjectsByHackathonEventHandler = async (
  ctx: QueryCtx,
  { hackathonEventId }: { hackathonEventId: z.infer<typeof HackathonEventIdSchema> },
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
      // TODO: remove after migration
      .map((project) => ({
        ...project,
        comments: project.comments || [],
        upvotes: project.upvotes || [],
      }));

    const userIds = new Set<ZodUserId>();
    projects.forEach((project) => {
      userIds.add(project.creatorUserId);
      // TODO: remove after migration
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
      Promise.all(Array.from(userIds).map((userId) => ctx.db.get(userId))),
      "Failed to get users for projects",
    );

    if (usersResult.isErr()) return err(usersResult.error);
    const users = usersResult.value;

    return safeParseConvexObject(ProjectListSchema, {
      projects,
      visibleUsers: users,
    });
};

export const getProjectsByHackathonEvent = projectQuery({
  args: { hackathonEventId: HackathonEventIdSchema },
  handler: (ctx, args) => serializeResult(_getProjectsByHackathonEventHandler(ctx, args)),
});
