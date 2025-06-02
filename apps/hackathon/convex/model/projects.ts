import { ConvexError } from "convex/values";
import { QueryCtx } from "../_generated/server";
import { ProjectId } from "~/server/zod";

export const getProjectById = async (ctx: QueryCtx, projectId: ProjectId) => {
  const project = await ctx.db.get(projectId);
  if (!project) {
    throw new ConvexError("Project not found.");
  }
  // TODO: remove after the migration
  return {
    ...project,
    comments: project.comments || [],
    upvotes: project.upvotes || [],
  };
};
