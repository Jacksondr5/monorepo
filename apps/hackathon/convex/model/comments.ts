import { ConvexError } from "convex/values";
import { ProjectId } from "~/server/zod";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { getCurrentUser } from "./users";
import { UpdateComment } from "~/server/zod";
import { getProjectById } from "./projects";

export const getCommentById = async (
  ctx: QueryCtx,
  projectId: ProjectId,
  commentId: string,
) => {
  const project = await getProjectById(ctx, projectId);
  const commentIndex = project.comments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) {
    throw new ConvexError("Comment not found.");
  }

  const comment = project.comments[commentIndex];
  return { comment, commentIndex, comments: project.comments };
};

export const updateComment = async (
  ctx: MutationCtx,
  projectId: ProjectId,
  commentId: string,
  newComment: Partial<UpdateComment>,
) => {
  const {
    comment: existingComment,
    commentIndex,
    comments,
  } = await getCommentById(ctx, projectId, commentId);
  const user = await getCurrentUser(ctx);
  if (existingComment.authorId !== user._id) {
    throw new ConvexError("Unauthorized to update this comment.");
  }
  const updatedComment = { ...existingComment, ...newComment };
  const updatedComments = [...comments];
  updatedComments[commentIndex] = updatedComment;

  await ctx.db.patch(projectId, {
    comments: updatedComments,
  });
};
