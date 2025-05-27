import { z } from "zod";
import { baseConvexFields } from "./utils";

export const UserRoleSchema = z.enum(["ADMIN", "USER"]);

export const UserSchema = z.object({
  ...baseConvexFields("users"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatarUrl: z.string().url().optional(),
  role: UserRoleSchema.default("USER"),
});

export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
