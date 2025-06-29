import { z } from "zod";
import { UserIdSchema } from "./user";
import { UpvoteSchema } from "./upvote";
// import { ProjectIdSchema } from "./project";
// import { FinalizedProjectIdSchema } from "./finalized-project";

export const CommentIdSchema = z.string();

export const CommentSchema = z.object({
  authorId: UserIdSchema,
  createdAt: z.number(), // NOTE: this is NOT the default Convex _createdAt
  id: CommentIdSchema, // Unique ID for each comment, generated on creation.  NOT the default Convex _id
  text: z.string().min(1),
  upvotes: z.array(UpvoteSchema),
});

// TODO: figure out how to make this work with convex-helpers
// const projectIdSchema = z.union([ProjectIdSchema, FinalizedProjectIdSchema]);
const projectIdSchema = z.string();

export const AddCommentSchema = z.object({
  projectId: projectIdSchema,
  text: z.string().min(1, "Comment cannot be empty."),
});

export const ToggleUpvoteOnCommentSchema = z.object({
  commentId: CommentIdSchema,
  projectId: projectIdSchema,
});

export const DeleteCommentSchema = z.object({
  commentId: CommentIdSchema,
  projectId: projectIdSchema,
});

export type Comment = z.infer<typeof CommentSchema>;
export type AddComment = z.infer<typeof AddCommentSchema>;
export type ToggleUpvoteOnComment = z.infer<typeof ToggleUpvoteOnCommentSchema>;
export type DeleteComment = z.infer<typeof DeleteCommentSchema>;
export type CommentId = z.infer<typeof CommentIdSchema>;
