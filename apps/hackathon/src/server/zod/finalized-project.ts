import { z } from "zod";
import { baseConvexFields, baseConvexFieldsOmit } from "./utils";
import { HackathonEventIdSchema } from "./hackathon-event";
import { UserIdSchema } from "./user";
import { zid } from "convex-helpers/server/zod";
import { CommentSchema } from "./comment";

export const FinalizedProjectIdSchema = zid("finalizedProjects");

export const InterestedUserSchema = z.object({
  // NOTE: this is NOT the default Convex _createdAt
  createdAt: z.number(),
  userId: UserIdSchema,
});

export const AssignedUserSchema = z.object({
  // NOTE: this is NOT the default Convex _createdAt
  createdAt: z.number(),
  userId: UserIdSchema,
});

export const FinalizedProjectSchema = z.object({
  ...baseConvexFields("finalizedProjects"),
  comments: z.array(CommentSchema),
  description: z.string().min(1),
  hackathonEventId: HackathonEventIdSchema,
  interestedUsers: z.array(InterestedUserSchema),
  assignedUsers: z.array(AssignedUserSchema).optional(),
  title: z.string().min(1),
  updatedAt: z.number(),
});

export const CreateFinalizedProjectSchema = FinalizedProjectSchema.omit({
  ...baseConvexFieldsOmit,
  comments: true, // Initialized by server
  interestedUsers: true, // Initialized by server
  assignedUsers: true, // Initialized by server
  updatedAt: true, // Set by the server mutation
});

export const UpdateFinalizedProjectSchema = FinalizedProjectSchema.omit({
  ...baseConvexFieldsOmit,
  comments: true, // Managed by dedicated mutations
  hackathonEventId: true, // Assuming this cannot be changed post-creation by client
  interestedUsers: true, // Managed by dedicated mutations
  assignedUsers: true, // Managed by dedicated mutations
  updatedAt: true, // Set by the server mutation
});

export type FinalizedProject = z.infer<typeof FinalizedProjectSchema>;
export type FinalizedProjectId = z.infer<typeof FinalizedProjectIdSchema>;
export type CreateFinalizedProject = z.infer<
  typeof CreateFinalizedProjectSchema
>;
export type UpdateFinalizedProject = z.infer<
  typeof UpdateFinalizedProjectSchema
>;
export type InterestedUser = z.infer<typeof InterestedUserSchema>;
export type AssignedUser = z.infer<typeof AssignedUserSchema>;
