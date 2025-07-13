import { QueryCtx, MutationCtx } from "../_generated/server";
import { err, ok, Result } from "neverthrow";
import {
  fromPromiseUnexpectedError,
  getNotFoundError,
  NotFoundError,
  DataIsUnexpectedShapeError,
  UnexpectedError,
  UnauthorizedError,
} from "./error";
import { getCurrentUserIdentity, GetCurrentUserIdentityError } from "./auth";
import { TaskSchema, ZodTask } from "../../src/server/zod";
import { Id } from "../_generated/dataModel";
import { UserIdentity } from "convex/server";

export type GetTaskByIdError =
  | NotFoundError<"TASK">
  | UnexpectedError
  | DataIsUnexpectedShapeError;

export const getTaskById = async (
  ctx: QueryCtx | MutationCtx,
  taskId: Id<"tasks">,
): Promise<Result<ZodTask, GetTaskByIdError>> => {
  const taskResult = await fromPromiseUnexpectedError(
    ctx.db.get(taskId),
    "Failed to get task",
  );

  if (taskResult.isErr()) {
    return err(taskResult.error);
  }

  if (!taskResult.value) {
    return err(getNotFoundError("TASK", taskId));
  }

  // Parse the task data directly since it comes from the database
  const parseResult = TaskSchema.safeParse(taskResult.value);
  if (!parseResult.success) {
    return err({
      type: "DATA_IS_UNEXPECTED_SHAPE",
      message: JSON.stringify(parseResult.error.format()),
    });
  }
  return ok(parseResult.data);
};

export type GetUserTasksError =
  | GetCurrentUserIdentityError
  | UnexpectedError
  | DataIsUnexpectedShapeError;

export const getUserTasks = async (
  ctx: QueryCtx,
): Promise<Result<ZodTask[], GetUserTasksError>> => {
  const identityResult = await getCurrentUserIdentity(ctx);
  if (identityResult.isErr()) return err(identityResult.error);

  const tasksResult = await fromPromiseUnexpectedError(
    ctx.db
      .query("tasks")
      .withIndex("by_created_by", (q) =>
        q.eq("createdById", identityResult.value.tokenIdentifier),
      )
      .order("asc")
      .collect(),
    "Failed to get user tasks",
  );

  if (tasksResult.isErr()) {
    return err(tasksResult.error);
  }

  const tasks = tasksResult.value;
  const parsedTasks: ZodTask[] = [];

  for (const task of tasks) {
    const parseResult = TaskSchema.safeParse(task);
    if (!parseResult.success) {
      return err({
        type: "DATA_IS_UNEXPECTED_SHAPE",
        message: JSON.stringify(parseResult.error.format()),
      });
    }
    parsedTasks.push(parseResult.data);
  }

  return ok(parsedTasks);
};

export type EnsureTaskOwnershipError =
  | GetCurrentUserIdentityError
  | GetTaskByIdError
  | UnauthorizedError;

export const ensureTaskOwnership = async (
  ctx: QueryCtx | MutationCtx,
  taskId: Id<"tasks">,
): Promise<
  Result<{ task: ZodTask; identity: UserIdentity }, EnsureTaskOwnershipError>
> => {
  const identityResult = await getCurrentUserIdentity(ctx);
  if (identityResult.isErr()) return err(identityResult.error);

  const taskResult = await getTaskById(ctx, taskId);
  if (taskResult.isErr()) return err(taskResult.error);

  const task = taskResult.value;
  if (task.createdById !== identityResult.value.tokenIdentifier) {
    return err({
      type: "UNAUTHORIZED",
      message: "You are not authorized to access this task.",
    });
  }

  return ok({ task, identity: identityResult.value });
};
