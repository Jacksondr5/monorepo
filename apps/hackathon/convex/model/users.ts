import { QueryCtx } from "../_generated/server";
import { UserSchema } from "../../src/server/zod/user";
import { ConvexError } from "convex/values";

export const getUserByClerkUserId = async (
  ctx: QueryCtx,
  clerkUserId: string,
) => {
  const user = await ctx.db
    .query("users")
    // TODO: use index when schema is finalized
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();
  return user ? UserSchema.parse(user) : null;
};

export const getCurrentUser = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("User must be authenticated.");
  }
  const user = await getUserByClerkUserId(ctx, identity.subject);
  if (!user) {
    throw new ConvexError("Current user not found.");
  }
  return user;
};

export const ensureCurrentUserIsAuthenticated = async (ctx: QueryCtx) => {
  void getCurrentUser(ctx);
};
