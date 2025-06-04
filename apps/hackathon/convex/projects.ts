import { z } from "zod";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { v4 as uuidv4 } from "uuid";
import {
  CreateProjectSchema,
  ProjectIdSchema,
  UpdateProjectSchema,
} from "../src/server/zod/project";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { getCurrentUser } from "./model/users";
import { HackathonEventIdSchema, ZodUserId } from "~/server/zod";
import { getCommentById, updateComment } from "./model/comments";
import { getProjectById } from "./model/projects";
import { ProjectListSchema } from "~/server/zod/views/project-list";

const projectQuery = zCustomQuery(query, NoOp);
const projectMutation = zCustomMutation(mutation, NoOp);

const CommentTargetArgsSchema = z.object({
  commentId: z.string(),
  projectId: ProjectIdSchema,
});

const ProjectTargetArgsSchema = z.object({
  projectId: ProjectIdSchema,
});

const AddCommentSchema = z.object({
  projectId: ProjectIdSchema,
  text: z.string().min(1, "Comment cannot be empty."),
});

const UpdateCommentSchema = z.object({
  commentId: z.string(),
  projectId: ProjectIdSchema,
  text: z.string().min(1, "Comment cannot be empty."),
});

// --- Mutations ---
export const createProject = projectMutation({
  args: { data: CreateProjectSchema },
  handler: async (ctx, { data }) => {
    const user = await getCurrentUser(ctx);
    const projectId = await ctx.db.insert("projects", {
      ...data,
      // Ensure new fields from schema are initialized
      comments: [],
      creatorUserId: user._id,
      updatedAt: Date.now(),
      upvotes: [],
    });
    return projectId;
  },
});

export const updateProject = projectMutation({
  args: {
    id: ProjectIdSchema,
    values: UpdateProjectSchema,
  },
  handler: async (ctx, { id, values }) => {
    const user = await getCurrentUser(ctx);
    const project = await ctx.db.get(id);
    if (!project) {
      throw new ConvexError("Project not found");
    }
    if (project.creatorUserId !== user._id) {
      throw new ConvexError("Unauthorized to update this project.");
    }

    await ctx.db.patch(id, {
      ...values,
      updatedAt: Date.now(),
    });
  },
});

export const deleteProject = projectMutation({
  args: { id: ProjectIdSchema },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUser(ctx);
    const project = await ctx.db.get(id);
    if (!project) {
      throw new ConvexError("Project not found");
    }
    if (project.creatorUserId !== user._id) {
      throw new ConvexError("Unauthorized to delete this project.");
    }
    await ctx.db.delete(id);
  },
});

export const addCommentToProject = projectMutation({
  args: AddCommentSchema,
  handler: async (ctx, { projectId, text }) => {
    const project = await getProjectById(ctx, projectId);
    const user = await getCurrentUser(ctx);

    const newComment = {
      authorId: user._id,
      createdAt: Date.now(),
      id: uuidv4(),
      text,
      upvotes: [],
    };

    await ctx.db.patch(project._id, {
      comments: [...project.comments, newComment],
    });
  },
});

export const updateCommentOnProject = projectMutation({
  args: UpdateCommentSchema,
  handler: async (ctx, { projectId, commentId, text }) => {
    await updateComment(ctx, projectId, commentId, { text });
  },
});

export const deleteComment = projectMutation({
  args: CommentTargetArgsSchema,
  handler: async (ctx, { projectId, commentId }) => {
    const user = await getCurrentUser(ctx);
    const project = await getProjectById(ctx, projectId);

    const { comment } = await getCommentById(ctx, projectId, commentId);

    if (comment.authorId !== user._id) {
      throw new ConvexError("Unauthorized to delete this comment.");
    }

    const updatedComments = project.comments.filter((c) => c.id !== commentId);

    await ctx.db.patch(project._id, {
      comments: updatedComments,
    });
  },
});

export const upvoteProject = projectMutation({
  args: ProjectTargetArgsSchema,
  handler: async (ctx, { projectId }) => {
    const project = await getProjectById(ctx, projectId);
    const user = await getCurrentUser(ctx);

    const existingUpvote = project.upvotes.find(
      (upvote) => upvote.userId === user._id,
    );
    if (existingUpvote) return;

    const newUpvote = {
      createdAt: Date.now(),
      userId: user._id,
    };
    await ctx.db.patch(project._id, {
      upvotes: [...project.upvotes, newUpvote],
      updatedAt: Date.now(),
    });
  },
});

export const removeUpvoteFromProject = projectMutation({
  args: ProjectTargetArgsSchema,
  handler: async (ctx, { projectId }) => {
    const user = await getCurrentUser(ctx);
    const project = await getProjectById(ctx, projectId);

    const updatedUpvotes = project.upvotes.filter(
      (upvote) => upvote.userId !== user._id,
    );

    if (updatedUpvotes.length === project.upvotes.length) return;

    await ctx.db.patch(project._id, {
      upvotes: updatedUpvotes,
      updatedAt: Date.now(),
    });
  },
});

export const upvoteComment = projectMutation({
  args: CommentTargetArgsSchema,
  handler: async (ctx, { projectId, commentId }) => {
    const { comment } = await getCommentById(ctx, projectId, commentId);
    const user = await getCurrentUser(ctx);

    const existingUpvote = comment.upvotes.find(
      (upvote) => upvote.userId === user._id,
    );

    if (existingUpvote) return; // Already upvoted

    const newUpvote = { createdAt: Date.now(), userId: user._id };
    const updatedCommentUpvotes = [...comment.upvotes, newUpvote];
    const updatedComment = {
      ...comment,
      upvotes: updatedCommentUpvotes,
    };

    await updateComment(ctx, projectId, commentId, updatedComment);
  },
});

export const removeUpvoteFromComment = projectMutation({
  args: CommentTargetArgsSchema,
  handler: async (ctx, { projectId, commentId }) => {
    const { comment } = await getCommentById(ctx, projectId, commentId);
    const user = await getCurrentUser(ctx);

    const existingUpvote = comment.upvotes.find(
      (upvote) => upvote.userId === user._id,
    );

    if (!existingUpvote) return; // Not upvoted

    const updatedCommentUpvotes = comment.upvotes.filter(
      (upvote) => upvote.userId !== user._id,
    );
    const updatedComment = {
      ...comment,
      upvotes: updatedCommentUpvotes,
    };

    await updateComment(ctx, projectId, commentId, updatedComment);
  },
});

// --- Queries ---
export const getProjectsByHackathonEvent = projectQuery({
  args: { hackathonEventId: HackathonEventIdSchema },
  handler: async (ctx, { hackathonEventId }) => {
    const projects = (
      await ctx.db
        .query("projects")
        .withIndex("by_hackathon_event", (q) =>
          q.eq("hackathonEventId", hackathonEventId),
        )
        .collect()
    )
      // TODO: remove after migration
      .map((project) => ({
        ...project,
        comments: project.comments || [],
        upvotes: project.upvotes || [],
      }));
    const userIds = new Set<ZodUserId>();
    projects.forEach((project) => {
      userIds.add(project.creatorUserId);
      // TODO: remove after migration
      if (project.comments) {
        project.comments.forEach((comment) => {
          userIds.add(comment.authorId);
          comment.upvotes.forEach((upvote) => {
            userIds.add(upvote.userId);
          });
        });
      }
      if (project.upvotes) {
        project.upvotes.forEach((upvote) => {
          userIds.add(upvote.userId);
        });
      }
    });
    const users = await Promise.all(
      Array.from(userIds).map((userId) => ctx.db.get(userId)),
    );
    return ProjectListSchema.parse({ projects, visibleUsers: users });
  },
  returns: ProjectListSchema,
});
