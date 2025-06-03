import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { query, mutation } from "./_generated/server";
import {
  UserIdSchema,
  UserSchema,
  CreateUserSchema,
} from "../src/server/zod/user";
import {
  getCurrentUser as modelGetCurrentUser,
  getUserByClerkUserId,
} from "./model/users";
import equal from "fast-deep-equal/es6";
import { ConvexError } from "convex/values";

const userQuery = zCustomQuery(query, NoOp);
const userMutation = zCustomMutation(mutation, NoOp);

export const createUser = userMutation({
  args: CreateUserSchema,
  handler: async (ctx, userData) => {
    const existing = await getUserByClerkUserId(ctx, userData.clerkUserId);
    if (existing) throw new Error("User already exists");
    const id = await ctx.db.insert("users", userData);
    return id;
  },
  returns: UserIdSchema,
});

export const upsertUser = userMutation({
  args: { user: CreateUserSchema },
  handler: async (ctx, { user }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User must be authenticated.");
    }
    const currentUser = await getUserByClerkUserId(ctx, identity.subject);
    if (currentUser) {
      const { _id, _creationTime, ...comparableUser } = currentUser;
      if (!equal(comparableUser, user)) {
        await ctx.db.patch(_id, user);
      }
      return _id;
    }
    const id = await ctx.db.insert("users", user);
    return id;
  },
  returns: UserIdSchema,
});

export const getUserById = userQuery({
  args: { userId: UserIdSchema },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (user) {
      return UserSchema.parse(user);
    }
    return null;
  },
  returns: UserSchema.nullable(),
});

export const getCurrentUser = userQuery({
  handler: async (ctx) => {
    return modelGetCurrentUser(ctx);
  },
  returns: UserSchema,
});
