import { z } from "zod";
import { baseConvexFields, baseConvexFieldsOmit } from "./utils";
import { HackathonEventIdSchema } from "./hackathon-event";
import { UserIdSchema } from "./user";
import { zid } from "convex-helpers/server/zod";

export const ProjectIdSchema = zid("projects");

export const ProjectSchema = z.object({
  ...baseConvexFields("projects"),
  creatorUserId: UserIdSchema,
  description: z.string().min(1),
  // TODO: add imageUrls
  // imageUrls: z.array(z.string().url()).optional(),
  hackathonEventId: HackathonEventIdSchema,
  title: z.string().min(1),
  updatedAt: z.number(),
});

export const CreateProjectSchema = ProjectSchema.omit({
  ...baseConvexFieldsOmit,
  creatorUserId: true, // Set by the server mutation
  updatedAt: true, // Set by the server mutation
});

export const UpdateProjectSchema = ProjectSchema.omit({
  ...baseConvexFieldsOmit,
  creatorUserId: true, // Cannot be changed by client
  hackathonEventId: true, // Assuming this cannot be changed post-creation by client
  updatedAt: true, // Set by the server mutation
});

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
