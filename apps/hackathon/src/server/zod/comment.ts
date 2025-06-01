import { z } from "zod";
// import { baseConvexFields } from "./utils";

export const CommentSchema = z.object({
  // ...baseConvexFields("comments"),
  projectId: z.string().describe("Foreign key to Project.id"),
  text: z.string().min(1),
  userId: z.string().describe("Foreign key to User.id"),
});

export type Comment = z.infer<typeof CommentSchema>;
