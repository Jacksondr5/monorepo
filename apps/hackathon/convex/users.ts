import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { query, mutation, MutationCtx, QueryCtx } from "./_generated/server";
import {
  UserIdSchema,
  UserSchema,
  CreateUserSchema,
  ZodUserId,
  ZodUser,
  ZodCreateUser,
} from "../src/server/zod/user";
import {
  getCurrentUser as modelGetCurrentUser,
  GetCurrentUserError,
  getUserByClerkUserIdNullable,
  getConvexUserIdentity,
} from "./model/users";
import equal from "fast-deep-equal/es6";
import {
  DataIsUnexpectedShapeError,
  fromPromiseUnexpectedError,
  getNotFoundError,
  NotFoundError,
  safeParseConvexObject,
  serializeResult,
  UnexpectedError,
} from "./model/error";
import { err, ok, Result } from "neverthrow";

const userQuery = zCustomQuery(query, NoOp);
const userMutation = zCustomMutation(mutation, NoOp);

export type UpsertUserError =
  | GetCurrentUserError
  | DataIsUnexpectedShapeError
  | UnexpectedError;

const _upsertUserHandler = async (
  ctx: MutationCtx,
  { user }: { user: ZodCreateUser },
): Promise<Result<ZodUserId, UpsertUserError>> => {
  const userIdentityResult = await getConvexUserIdentity(ctx);
  if (userIdentityResult.isErr()) return err(userIdentityResult.error);

  const existingUserResult = await getUserByClerkUserIdNullable(
    ctx,
    userIdentityResult.value.subject,
  );
  if (existingUserResult.isErr()) {
    return err(existingUserResult.error);
  }

  // If the user doesn't exist, create it
  if (!existingUserResult.value) {
    return fromPromiseUnexpectedError(
      ctx.db.insert("users", user),
      "while creating the user",
    );
  }

  // If the user exists, update it
  const currentUser = existingUserResult.value;
  const { _id, _creationTime, ...comparableUser } = currentUser;
  if (comparableUser !== user && !equal(comparableUser, user)) {
    return fromPromiseUnexpectedError(
      ctx.db.patch(_id, user),
      "while updating the user",
    ).andThen(() => ok(_id));
  }
  return ok(_id);
};

export const upsertUser = userMutation({
  args: { user: CreateUserSchema },
  handler: (ctx, { user }) =>
    serializeResult(_upsertUserHandler(ctx, { user })),
});

export type GetUserByIdError =
  | UnexpectedError
  | NotFoundError<"USER">
  | DataIsUnexpectedShapeError;

const _getUserByIdHandler = async (
  ctx: QueryCtx,
  { userId }: { userId: ZodUserId },
): Promise<Result<ZodUser, GetUserByIdError>> => {
  const userResult = await fromPromiseUnexpectedError(ctx.db.get(userId));
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;
  if (!user) {
    return err(getNotFoundError("USER", userId));
  }
  return safeParseConvexObject(UserSchema, user);
};

export const getUserById = userQuery({
  args: { userId: UserIdSchema },
  handler: (ctx, { userId }) =>
    serializeResult(_getUserByIdHandler(ctx, { userId })),
});

export const getCurrentUser = userQuery({
  handler: async (ctx) => {
    return serializeResult(modelGetCurrentUser(ctx));
  },
});
