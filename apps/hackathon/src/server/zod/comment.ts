import { z } from "zod";
import { baseConvexFields } from "./utils";

export const CommentSchema = z.object({
  ...baseConvexFields("comments"),
  userId: z.string().describe("Foreign key to User.id"),
  ideaId: z.string().describe("Foreign key to Idea.id"),
  text: z.string().min(1),
});

export type Comment = z.infer<typeof CommentSchema>;
