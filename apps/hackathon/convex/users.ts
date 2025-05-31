import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { query, mutation } from "./_generated/server";
import {
  UserIdSchema,
  UserSchema,
  CreateUserSchema,
  UserUpdateSchema,
} from "../src/server/zod/user";
import z from "zod";

const userQuery = zCustomQuery(query, NoOp);
const userMutation = zCustomMutation(mutation, NoOp);

// 1. Get a user by their clerkUserId
export const getUserByClerkUserId = userQuery({
  args: z.object({ clerkUserId: z.string() }),
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      // TODO: use index when schema is finalized
      // .withIndex("by_clerkUserId", q => q.eq("clerkUserId", clerkUserId))
      .filter((q) => q.eq("clerkUserId", clerkUserId))
      .unique();
    return user ? UserSchema.parse(user) : null;
  },
  returns: UserSchema.nullable(),
});

// 2. Create a new user
export const createUser = userMutation({
  args: CreateUserSchema,
  handler: async (ctx, userData) => {
    // Ensure a user with this clerkUserId does not already exist
    const existing = await ctx.db
      .query("users")
      // TODO: use index when schema is finalized
      // .withIndex("by_clerkUserId", q => q.eq("clerkUserId", userData.clerkUserId))
      .filter((q) => q.eq("clerkUserId", userData.clerkUserId))
      .unique();
    if (existing) throw new Error("User already exists");
    const id = await ctx.db.insert("users", userData);
    return id;
  },
  returns: UserIdSchema,
});

// 3. Update an existing user
export const updateUser = userMutation({
  args: { _id: UserIdSchema, update: UserUpdateSchema },
  handler: async (ctx, { _id, update }) => {
    const user = await ctx.db.get(_id);
    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, update);
  },
});

export const store = userMutation({
  args: { user: CreateUserSchema },
  handler: async (ctx, { user }) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      // TODO: use index when schema is finalized
      // .withIndex("by_clerkUserId", q => q.eq("clerkUserId", user.clerkUserId))
      .filter((q) => q.eq(q.field("clerkUserId"), user.clerkUserId))
      .unique();
    // Check if existing user is identical to the one we want to store
    if (existing) {
      // TODO: replace with better comparison
      if (
        existing.firstName !== user.firstName ||
        existing.lastName !== user.lastName ||
        existing.avatarUrl !== user.avatarUrl ||
        existing.role !== user.role
      ) {
        // Patch user
        await ctx.db.patch(existing._id, user);
      }
      return existing._id;
    }
    const id = await ctx.db.insert("users", user);
    return id;
  },
  returns: UserIdSchema,
});
