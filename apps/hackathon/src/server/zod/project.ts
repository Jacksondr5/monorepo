import { z } from "zod";
import { baseConvexFields, baseConvexFieldsOmit } from "./utils";
import { HackathonEventIdSchema } from "./hackathon-event";
import { UserIdSchema } from "./user";
import { zid } from "convex-helpers/server/zod";
import { CommentSchema } from "./comment";
import { UpvoteSchema } from "./upvote";

export const ProjectIdSchema = zid("projects");

export const ProjectSchema = z.object({
  ...baseConvexFields("projects"),
  creatorUserId: UserIdSchema,
  comments: z.array(CommentSchema),
  description: z.string().min(1),
  // TODO: add imageUrls (JAC-74)
  // imageUrls: z.array(z.string().url()).optional(),
  hackathonEventId: HackathonEventIdSchema,
  title: z.string().min(1),
  updatedAt: z.number(),
  upvotes: z.array(UpvoteSchema),
});

export const CreateProjectSchema = ProjectSchema.omit({
  ...baseConvexFieldsOmit,
  comments: true, // Initialized by server
  creatorUserId: true, // Set by the server mutation
  updatedAt: true, // Set by the server mutation
  upvotes: true, // Initialized by server
});

export const UpdateProjectSchema = ProjectSchema.omit({
  ...baseConvexFieldsOmit,
  comments: true, // Managed by dedicated mutations
  creatorUserId: true, // Cannot be changed by client
  hackathonEventId: true, // Assuming this cannot be changed post-creation by client
  updatedAt: true, // Set by the server mutation
  upvotes: true, // Managed by dedicated mutations
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectId = z.infer<typeof ProjectIdSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
