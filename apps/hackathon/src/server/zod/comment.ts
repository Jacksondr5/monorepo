import { z } from "zod";
import { UserIdSchema } from "./user";
import { UpvoteSchema } from "./upvote";

export const CommentIdSchema = z.string();

export const CommentSchema = z.object({
  authorId: UserIdSchema,
  createdAt: z.number(), // NOTE: this is NOT the default Convex _createdAt
  id: CommentIdSchema, // Unique ID for each comment, generated on creation.  NOT the default Convex _id
  text: z.string().min(1),
  upvotes: z.array(UpvoteSchema),
});

export const UpdateCommentSchema = CommentSchema.omit({
  authorId: true,
  createdAt: true,
  id: true,
});

export type Comment = z.infer<typeof CommentSchema>;
export type UpdateComment = z.infer<typeof UpdateCommentSchema>;
export type CommentId = z.infer<typeof CommentIdSchema>;
