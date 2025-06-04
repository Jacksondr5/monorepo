import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { query, mutation } from "./_generated/server";
import {
  UserIdSchema,
  UserSchema,
  CreateUserSchema,
  ZodUserId,
  ZodUser,
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
  UnexpectedError,
} from "./model/error";
import { err, ok, Result } from "neverthrow";

const userQuery = zCustomQuery(query, NoOp);
const userMutation = zCustomMutation(mutation, NoOp);

// export type CreateUserError =
//   | J5BaseError<"USER_ALREADY_EXISTS">
//   | GetUserByClerkUserIdError
//   | DataIsUnexpectedShapeError
//   | UnexpectedError;

// export const createUser = userMutation({
//   args: CreateUserSchema,
//   handler: async (
//     ctx,
//     userData,
//   ): Promise<Result<ZodUserId, CreateUserError>> => {
//     const existing = await getUserByClerkUserId(ctx, userData.clerkUserId);
//     if (existing.isOk()) {
//       return err({
//         type: "USER_ALREADY_EXISTS",
//         message: "User already exists.",
//       });
//     }
//     if (existing.error.type !== "USER_NOT_FOUND") {
//       return err(existing.error);
//     }
//     const insertResult = await fromPromise(
//       ctx.db.insert("users", userData),
//       (originalError) => originalError,
//     );
//     if (insertResult.isErr()) {
//       return err({
//         type: "UNEXPECTED_ERROR",
//         message: "There was an unexpected error creating the user.",
//         originalError: insertResult.error,
//       });
//     }
//     const id = insertResult.value;
//     return ok(id);
//   },
// });

export type UpsertUserError =
  | GetCurrentUserError
  | DataIsUnexpectedShapeError
  | UnexpectedError;

export const upsertUser = userMutation({
  args: { user: CreateUserSchema },
  handler: async (
    ctx,
    { user },
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
    if (!equal(comparableUser, user)) {
      return fromPromiseUnexpectedError(
        ctx.db.patch(_id, user),
        "while updating the user",
      ).andThen(() => ok(_id));
    }
    return ok(_id);
  },
});

export type GetUserByIdError =
  | UnexpectedError
  | NotFoundError<"USER">
  | DataIsUnexpectedShapeError;

export const getUserById = userQuery({
  args: { userId: UserIdSchema },
  handler: async (
    ctx,
    { userId },
  ): Promise<Result<ZodUser, GetUserByIdError>> => {
    const userResult = await fromPromiseUnexpectedError(ctx.db.get(userId));
    if (userResult.isErr()) return err(userResult.error);
    const user = userResult.value;
    if (!user) {
      return err(getNotFoundError("USER", userId));
    }
    return safeParseConvexObject(UserSchema, user);
  },
});

export const getCurrentUser = userQuery({
  handler: async (ctx) => {
    return modelGetCurrentUser(ctx);
  },
});
