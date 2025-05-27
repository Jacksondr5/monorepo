import { z } from "zod";
import { baseConvexFields } from "./utils";

export const IdeaSchema = z.object({
  ...baseConvexFields("ideas"),
  userId: z.string().describe("Foreign key to User.id"),
  hackathonEventId: z.string().describe("Foreign key to HackathonEvent.id"),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  imageUrls: z.array(z.string().url()).optional(),
  isFinalized: z
    .boolean()
    .default(false)
    .describe("Admin marks if ready for voting"),
  updatedAt: z.date().optional(),
});

export type Idea = z.infer<typeof IdeaSchema>;
