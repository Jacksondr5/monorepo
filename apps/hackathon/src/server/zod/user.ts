import { z } from "zod";
import { baseConvexFields } from "./utils";
import { zid } from "convex-helpers/server/zod";

export const UserRoleSchema = z.enum(["ADMIN", "USER"]);

export const UserIdSchema = zid("users");

export const UserSchema = z.object({
  ...baseConvexFields("users"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatarUrl: z.string().url(),
  clerkUserId: z.string(),
  role: UserRoleSchema.default("USER"),
});

export const CreateUserSchema = UserSchema.omit({
  _id: true,
  _creationTime: true,
});

export const UserUpdateSchema = UserSchema.omit({
  clerkUserId: true,
  _id: true,
});

export type zodUser = z.infer<typeof UserSchema>;
export type zodUserRole = z.infer<typeof UserRoleSchema>;
export type zodCreateUser = z.infer<typeof CreateUserSchema>;
export type zodUserUpdate = z.infer<typeof UserUpdateSchema>;
