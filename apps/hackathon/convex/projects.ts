import { z } from "zod";
import { mutation, query, MutationCtx } from "./_generated/server";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { getCurrentUser, GetCurrentUserError } from "./model/users";
import {
  HackathonEventIdSchema,
  CreateProjectSchema,
  ProjectId,
  ProjectIdSchema,
  UpdateProjectSchema,
} from "~/server/zod";
import {
  getProjectById,
  GetProjectByIdError,
  getProjectsByHackathonEvent as modelGetProjectsByHackathonEvent,
} from "./model/projects";
import {
  fromPromiseUnexpectedError,
  UnexpectedError,
  UnauthorizedError,
  DataIsUnexpectedShapeError,
  serializeResult,
} from "./model/error";
import { err, ok, Result } from "neverthrow";

const projectQuery = zCustomQuery(query, NoOp);
const projectMutation = zCustomMutation(mutation, NoOp);

const ProjectTargetArgsSchema = z.object({
  projectId: ProjectIdSchema,
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

export type UpvoteProjectError =
  | GetCurrentUserError
  | GetProjectByIdError
  | UnexpectedError;

export type RemoveUpvoteFromProjectError =
  | GetCurrentUserError
  | GetProjectByIdError
  | UnexpectedError;

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
  {
    id,
    values,
  }: { id: ProjectId; values: z.infer<typeof UpdateProjectSchema> },
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
  handler: (ctx, args) =>
    serializeResult(_removeUpvoteFromProjectHandler(ctx, args)),
});

// --- Queries ---
export const getProjectsByHackathonEvent = projectQuery({
  args: { hackathonEventId: HackathonEventIdSchema },
  handler: (ctx, { hackathonEventId }) =>
    serializeResult(modelGetProjectsByHackathonEvent(ctx, hackathonEventId)),
});
