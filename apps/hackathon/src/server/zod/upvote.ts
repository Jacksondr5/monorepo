import { z } from "zod";
import { UserIdSchema } from "./user";

export const UpvoteSchema = z.object({
  // NOTE: this is NOT the default Convex _createdAt
  createdAt: z.number(),
  userId: UserIdSchema,
});

export type Upvote = z.infer<typeof UpvoteSchema>;
