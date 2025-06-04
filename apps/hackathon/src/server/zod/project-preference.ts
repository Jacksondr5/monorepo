import { z } from "zod";
// import { baseConvexFields } from "./utils";

export const ProjectPreferenceSchema = z.object({
  // ...baseConvexFields("projectPreferences"),
  userId: z.string().describe("Foreign key to User.id"),
  ideaId: z.string().describe("Foreign key to Idea.id - the preferred project"),
});

export type ProjectPreference = z.infer<typeof ProjectPreferenceSchema>;
