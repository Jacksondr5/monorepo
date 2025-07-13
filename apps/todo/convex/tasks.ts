import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { err, ok, Result } from "neverthrow";
import {
  CreateTaskSchema,
  SetTaskDescriptionSchema,
  SetTaskBlockedSchema,
  SetTaskDoneSchema,
  SetTaskImportantSchema,
  SetTaskUrgentSchema,
  SetTaskTitleSchema,
  DeleteTaskSchema,
  ZodTask,
} from "../src/server/zod";
import {
  serializeResult,
  fromPromiseUnexpectedError,
  UnexpectedError,
} from "./model/error";
import {
  getUserTasks,
  GetUserTasksError,
  ensureTaskOwnership,
  EnsureTaskOwnershipError,
} from "./model/tasks";
import {
  getCurrentUserIdentity,
  GetCurrentUserIdentityError,
} from "./model/auth";
import { z } from "zod";
import { Id } from "./_generated/dataModel";

const taskQuery = zCustomQuery(query, NoOp);
const taskMutation = zCustomMutation(mutation, NoOp);

// Query to get all tasks for the current user
export type GetTasksError = GetUserTasksError;

const _getTasksHandler = async (
  ctx: QueryCtx,
): Promise<Result<ZodTask[], GetTasksError>> => {
  return getUserTasks(ctx);
};

export const getTasks = taskQuery({
  args: {},
  handler: (ctx) => serializeResult(_getTasksHandler(ctx)),
});

// Mutation to create a new task
export type CreateTaskError = GetCurrentUserIdentityError | UnexpectedError;

const _createTaskHandler = async (
  ctx: MutationCtx,
  args: z.infer<typeof CreateTaskSchema>,
): Promise<Result<Id<"tasks">, CreateTaskError>> => {
  const identityResult = await getCurrentUserIdentity(ctx);
  if (identityResult.isErr()) return err(identityResult.error);

  const taskResult = await fromPromiseUnexpectedError(
    ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      isBlocked: false,
      isDone: false,
      isImportant: args.isImportant,
      isUrgent: args.isUrgent,
      createdById: identityResult.value.tokenIdentifier,
      updatedAt: Date.now(),
    }),
    "Failed to create task",
  );

  if (taskResult.isErr()) return err(taskResult.error);

  return ok(taskResult.value as Id<"tasks">);
};

export const createTask = taskMutation({
  args: CreateTaskSchema,
  handler: (ctx, args) => serializeResult(_createTaskHandler(ctx, args)),
});

// Mutation to update task description
export type SetDescriptionError = EnsureTaskOwnershipError | UnexpectedError;

const _setDescriptionHandler = async (
  ctx: MutationCtx,
  args: z.infer<typeof SetTaskDescriptionSchema>,
): Promise<Result<void, SetDescriptionError>> => {
  const ownershipResult = await ensureTaskOwnership(
    ctx,
    args.id as Id<"tasks">,
  );
  if (ownershipResult.isErr()) return err(ownershipResult.error);

  const updateResult = await fromPromiseUnexpectedError(
    ctx.db.patch(args.id as Id<"tasks">, {
      description: args.description,
      updatedAt: Date.now(),
    }),
    "Failed to update task description",
  );

  if (updateResult.isErr()) return err(updateResult.error);

  return ok();
};

export const setDescription = taskMutation({
  args: SetTaskDescriptionSchema,
  handler: (ctx, args) => serializeResult(_setDescriptionHandler(ctx, args)),
});

// Mutation to update task blocked status
export type SetIsBlockedError = EnsureTaskOwnershipError | UnexpectedError;

const _setIsBlockedHandler = async (
  ctx: MutationCtx,
  args: z.infer<typeof SetTaskBlockedSchema>,
): Promise<Result<void, SetIsBlockedError>> => {
  const ownershipResult = await ensureTaskOwnership(
    ctx,
    args.id as Id<"tasks">,
  );
  if (ownershipResult.isErr()) return err(ownershipResult.error);

  const updateResult = await fromPromiseUnexpectedError(
    ctx.db.patch(args.id as Id<"tasks">, {
      isBlocked: args.isBlocked,
      updatedAt: Date.now(),
    }),
    "Failed to update task blocked status",
  );

  if (updateResult.isErr()) return err(updateResult.error);

  return ok();
};

export const setIsBlocked = taskMutation({
  args: SetTaskBlockedSchema,
  handler: (ctx, args) => serializeResult(_setIsBlockedHandler(ctx, args)),
});

// Mutation to update task done status
export type SetIsDoneError = EnsureTaskOwnershipError | UnexpectedError;

const _setIsDoneHandler = async (
  ctx: MutationCtx,
  args: z.infer<typeof SetTaskDoneSchema>,
): Promise<Result<void, SetIsDoneError>> => {
  const ownershipResult = await ensureTaskOwnership(
    ctx,
    args.id as Id<"tasks">,
  );
  if (ownershipResult.isErr()) return err(ownershipResult.error);

  const updateResult = await fromPromiseUnexpectedError(
    ctx.db.patch(args.id as Id<"tasks">, {
      isDone: args.isDone,
      updatedAt: Date.now(),
    }),
    "Failed to update task done status",
  );

  if (updateResult.isErr()) return err(updateResult.error);

  return ok();
};

export const setIsDone = taskMutation({
  args: SetTaskDoneSchema,
  handler: (ctx, args) => serializeResult(_setIsDoneHandler(ctx, args)),
});

// Mutation to update task importance
export type SetIsImportantError = EnsureTaskOwnershipError | UnexpectedError;

const _setIsImportantHandler = async (
  ctx: MutationCtx,
  args: z.infer<typeof SetTaskImportantSchema>,
): Promise<Result<void, SetIsImportantError>> => {
  const ownershipResult = await ensureTaskOwnership(
    ctx,
    args.id as Id<"tasks">,
  );
  if (ownershipResult.isErr()) return err(ownershipResult.error);

  const updateResult = await fromPromiseUnexpectedError(
    ctx.db.patch(args.id as Id<"tasks">, {
      isImportant: args.isImportant,
      updatedAt: Date.now(),
    }),
    "Failed to update task importance",
  );

  if (updateResult.isErr()) return err(updateResult.error);

  return ok();
};

export const setIsImportant = taskMutation({
  args: SetTaskImportantSchema,
  handler: (ctx, args) => serializeResult(_setIsImportantHandler(ctx, args)),
});

// Mutation to update task urgency
export type SetIsUrgentError = EnsureTaskOwnershipError | UnexpectedError;

const _setIsUrgentHandler = async (
  ctx: MutationCtx,
  args: z.infer<typeof SetTaskUrgentSchema>,
): Promise<Result<void, SetIsUrgentError>> => {
  const ownershipResult = await ensureTaskOwnership(
    ctx,
    args.id as Id<"tasks">,
  );
  if (ownershipResult.isErr()) return err(ownershipResult.error);

  const updateResult = await fromPromiseUnexpectedError(
    ctx.db.patch(args.id as Id<"tasks">, {
      isUrgent: args.isUrgent,
      updatedAt: Date.now(),
    }),
    "Failed to update task urgency",
  );

  if (updateResult.isErr()) return err(updateResult.error);

  return ok();
};

export const setIsUrgent = taskMutation({
  args: SetTaskUrgentSchema,
  handler: (ctx, args) => serializeResult(_setIsUrgentHandler(ctx, args)),
});

// Mutation to update task title
export type SetTitleError = EnsureTaskOwnershipError | UnexpectedError;

const _setTitleHandler = async (
  ctx: MutationCtx,
  args: z.infer<typeof SetTaskTitleSchema>,
): Promise<Result<void, SetTitleError>> => {
  const ownershipResult = await ensureTaskOwnership(
    ctx,
    args.id as Id<"tasks">,
  );
  if (ownershipResult.isErr()) return err(ownershipResult.error);

  const updateResult = await fromPromiseUnexpectedError(
    ctx.db.patch(args.id as Id<"tasks">, {
      title: args.title,
      updatedAt: Date.now(),
    }),
    "Failed to update task title",
  );

  if (updateResult.isErr()) return err(updateResult.error);

  return ok();
};

export const setTitle = taskMutation({
  args: SetTaskTitleSchema,
  handler: (ctx, args) => serializeResult(_setTitleHandler(ctx, args)),
});

// Mutation to delete a task
export type DeleteTaskError = EnsureTaskOwnershipError | UnexpectedError;

const _deleteTaskHandler = async (
  ctx: MutationCtx,
  args: z.infer<typeof DeleteTaskSchema>,
): Promise<Result<void, DeleteTaskError>> => {
  const ownershipResult = await ensureTaskOwnership(
    ctx,
    args.id as Id<"tasks">,
  );
  if (ownershipResult.isErr()) return err(ownershipResult.error);

  const deleteResult = await fromPromiseUnexpectedError(
    ctx.db.delete(args.id as Id<"tasks">),
    "Failed to delete task",
  );

  if (deleteResult.isErr()) return err(deleteResult.error);

  return ok();
};

export const deleteTask = taskMutation({
  args: DeleteTaskSchema,
  handler: (ctx, args) => serializeResult(_deleteTaskHandler(ctx, args)),
});
