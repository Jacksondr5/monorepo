import { z } from "zod";
// import { baseConvexFields } from "./utils";

export const UpvoteSchema = z.object({
  // ...baseConvexFields("upvotes"),
  userId: z.string().describe("Foreign key to User.id"),
  ideaId: z.string().describe("Foreign key to Idea.id"),
});

export type Upvote = z.infer<typeof UpvoteSchema>;
