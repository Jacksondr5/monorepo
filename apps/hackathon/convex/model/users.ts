import { QueryCtx } from "../_generated/server";
import { UserSchema, ZodUser } from "../../src/server/zod/user";
import { err, fromPromise, ok, Result } from "neverthrow";
import {
  getNotFoundError,
  NotFoundError,
  NotUniqueError,
  DataIsUnexpectedShapeError,
  safeParseConvexObject,
  unauthenticatedError,
  UnauthenticatedError,
  UnexpectedError,
} from "./error";
import { UserIdentity } from "convex/server";

export type GetUserByClerkUserIdNullableError =
  | NotUniqueError
  | DataIsUnexpectedShapeError;

/**
 * A nullable version of getUserByClerkUserId
 * @returns A Result containing the user if found, null if not found, or an error if there was an unexpected error
 */
export const getUserByClerkUserIdNullable = async (
  ctx: QueryCtx,
  clerkUserId: string,
): Promise<Result<ZodUser | null, GetUserByClerkUserIdNullableError>> => {
  const userResult = await fromPromise(
    ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
      .unique(),
    (originalError) => originalError,
  );

  if (userResult.isErr()) {
    const originalError = userResult.error;
    return err({
      type: "NOT_UNIQUE",
      message:
        "There was an unexpected error getting the user.  This was likely due to a duplicate clerk user id.",
      originalError,
      uniqueConstraint: "users.by_clerk_user_id",
    });
  }

  const user = userResult.value;

  if (!user) {
    return ok(null);
  }

  return safeParseConvexObject(UserSchema, user);
};

export type GetUserByClerkUserIdError =
  | GetUserByClerkUserIdNullableError
  | NotFoundError<"USER">;

/**
 *  A non-nullable version of getUserByClerkUserId
 * @returns A Result containing the user if found, or an error if not found
 */
export const getUserByClerkUserId = async (
  ctx: QueryCtx,
  clerkUserId: string,
): Promise<Result<ZodUser, GetUserByClerkUserIdError>> => {
  const result = await getUserByClerkUserIdNullable(ctx, clerkUserId);
  if (result.isErr()) {
    return err(result.error);
  }
  if (!result.value) {
    return err(getNotFoundError("USER", clerkUserId));
  }
  return ok(result.value);
};

export type GetCurrentUserError =
  | UnauthenticatedError
  | GetUserByClerkUserIdError
  | UnexpectedError;

export const getCurrentUser = async (
  ctx: QueryCtx,
): Promise<Result<ZodUser, GetCurrentUserError>> => {
  const userIdentityResult = await getConvexUserIdentity(ctx);
  if (userIdentityResult.isErr()) return err(userIdentityResult.error);

  return getUserByClerkUserId(ctx, userIdentityResult.value.subject);
};

export const ensureCurrentUserIsAuthenticated = async (ctx: QueryCtx) => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return userResult;
  return ok();
};

export const getConvexUserIdentity = async (
  ctx: QueryCtx,
): Promise<Result<UserIdentity, UnexpectedError | UnauthenticatedError>> => {
  const userIdentityResult = await fromPromise(
    ctx.auth.getUserIdentity(),
    (originalError) => originalError,
  );

  if (userIdentityResult.isErr()) {
    return err({
      type: "UNEXPECTED_ERROR",
      message: "There was an unexpected error getting the current user.",
      originalError: userIdentityResult.error,
    });
  }

  if (!userIdentityResult.value) {
    return err(unauthenticatedError);
  }

  return ok(userIdentityResult.value);
};

export type GetAllUsersError = UnexpectedError | DataIsUnexpectedShapeError;

export const getAllUsers = async (
  ctx: QueryCtx,
): Promise<Result<ZodUser[], GetAllUsersError>> => {
  const usersResult = await fromPromise(
    ctx.db.query("users").collect(),
    (originalError) => originalError,
  );

  if (usersResult.isErr()) {
    return err({
      type: "UNEXPECTED_ERROR",
      message: "There was an unexpected error getting all users.",
      originalError: usersResult.error,
    });
  }

  const users = usersResult.value;
  const parsedUsers: ZodUser[] = [];

  for (const user of users) {
    const parseResult = safeParseConvexObject(UserSchema, user);
    if (parseResult.isErr()) return err(parseResult.error);
    parsedUsers.push(parseResult.value);
  }

  return ok(parsedUsers);
};
