import { QueryCtx, MutationCtx } from "../_generated/server";
import { err, fromPromise, ok, Result } from "neverthrow";
import {
  unauthenticatedError,
  UnauthenticatedError,
  UnexpectedError,
} from "./error";
import { UserIdentity } from "convex/server";

export const getConvexUserIdentity = async (
  ctx: QueryCtx | MutationCtx,
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

export type GetCurrentUserIdentityError =
  | UnexpectedError
  | UnauthenticatedError;

export const getCurrentUserIdentity = async (
  ctx: QueryCtx | MutationCtx,
): Promise<Result<UserIdentity, GetCurrentUserIdentityError>> => {
  return getConvexUserIdentity(ctx);
};
