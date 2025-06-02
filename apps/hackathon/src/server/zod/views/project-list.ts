import { z } from "zod";
import { ProjectSchema } from "../project";
import { UserSchema } from "../user";

export const ProjectListSchema = z.object({
  projects: z.array(ProjectSchema),
  visibleUsers: z.array(UserSchema),
});

export type ProjectList = z.infer<typeof ProjectListSchema>;
