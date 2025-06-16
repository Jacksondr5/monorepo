import { z } from "zod";
import { FinalizedProjectSchema } from "../finalized-project";
import { UserSchema } from "../user";

export const FinalizedProjectListSchema = z.object({
  projects: z.array(FinalizedProjectSchema),
  visibleUsers: z.array(UserSchema),
});

export type FinalizedProjectList = z.infer<typeof FinalizedProjectListSchema>;
