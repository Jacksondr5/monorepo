import { z } from "zod";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import {
  CreateProjectSchema,
  ProjectIdSchema,
  ProjectSchema,
  UpdateProjectSchema,
} from "../src/server/zod/project";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { getCurrentUser } from "./model/users";
import { HackathonEventIdSchema } from "~/server/zod";

const projectQuery = zCustomQuery(query, NoOp);
const projectMutation = zCustomMutation(mutation, NoOp);

export const createProject = projectMutation({
  args: { data: CreateProjectSchema },
  handler: async (ctx, { data }) => {
    const user = await getCurrentUser(ctx);
    const projectId = await ctx.db.insert("projects", {
      ...data,
      creatorUserId: user._id,
      updatedAt: new Date().getTime(),
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
      updatedAt: new Date().getTime(),
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

export const getProjectsByHackathonEvent = projectQuery({
  args: { hackathonEventId: HackathonEventIdSchema },
  handler: async (ctx, { hackathonEventId }) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_hackathon_event", (q) =>
        q.eq("hackathonEventId", hackathonEventId),
      )
      .collect();
    return z.array(ProjectSchema).parse(projects);
  },
  returns: z.array(ProjectSchema),
});
