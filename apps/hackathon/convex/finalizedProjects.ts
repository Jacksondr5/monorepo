import { z } from "zod";
import { mutation, query, MutationCtx } from "./_generated/server";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  getCurrentUser,
  GetCurrentUserError,
  getAllUsers as modelGetAllUsers,
} from "./model/users";
import {
  getFinalizedProjectById,
  GetFinalizedProjectByIdError,
  getFinalizedProjectsByHackathonEvent as modelGetFinalizedProjectsByHackathonEvent,
} from "./model/finalizedProjects";
import {
  fromPromiseUnexpectedError,
  UnexpectedError,
  UnauthorizedError,
  DataIsUnexpectedShapeError,
  serializeResult,
} from "./model/error";
import { err, ok, Result } from "neverthrow";
import {
  HackathonEventIdSchema,
  UserIdSchema,
  CreateFinalizedProjectSchema,
  FinalizedProjectId,
  FinalizedProjectIdSchema,
  UpdateFinalizedProjectSchema,
} from "~/server/zod";

const finalizedProjectQuery = zCustomQuery(query, NoOp);
const finalizedProjectMutation = zCustomMutation(mutation, NoOp);

const ProjectTargetArgsSchema = z.object({
  projectId: FinalizedProjectIdSchema,
});

const AssignUserSchema = z.object({
  projectId: FinalizedProjectIdSchema,
  userId: UserIdSchema,
});

export type CreateFinalizedProjectError =
  | GetCurrentUserError
  | UnauthorizedError
  | UnexpectedError;

export type UpdateFinalizedProjectError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnauthorizedError
  | UnexpectedError;

export type DeleteFinalizedProjectError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnauthorizedError
  | UnexpectedError;

export type AddInterestedUserError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnexpectedError;

export type RemoveInterestedUserError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnexpectedError;

export type AssignUserToProjectError =
  | GetCurrentUserError
  | GetFinalizedProjectByIdError
  | UnauthorizedError
  | UnexpectedError;

export type GetFinalizedProjectsByHackathonEventError =
  | UnexpectedError
  | DataIsUnexpectedShapeError;

// --- Mutations ---
const _createFinalizedProjectHandler = async (
  ctx: MutationCtx,
  { data }: { data: z.infer<typeof CreateFinalizedProjectSchema> },
): Promise<Result<FinalizedProjectId, CreateFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  // Only admins can create finalized projects
  if (user.role !== "ADMIN") {
    return err({
      type: "UNAUTHORIZED",
      message: "Only admins can create finalized projects.",
    } satisfies UnauthorizedError);
  }

  const projectIdResult = await fromPromiseUnexpectedError(
    ctx.db.insert("finalizedProjects", {
      ...data,
      // Ensure new fields from schema are initialized
      comments: [],
      interestedUsers: [],
      assignedUsers: [],
      updatedAt: Date.now(),
    }),
  );
  return projectIdResult;
};

export const createFinalizedProject = finalizedProjectMutation({
  args: { data: CreateFinalizedProjectSchema },
  handler: (ctx, args) =>
    serializeResult(_createFinalizedProjectHandler(ctx, args)),
});

const _updateFinalizedProjectHandler = async (
  ctx: MutationCtx,
  {
    id,
    values,
  }: {
    id: FinalizedProjectId;
    values: z.infer<typeof UpdateFinalizedProjectSchema>;
  },
): Promise<Result<void, UpdateFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  // Only admins can update finalized projects
  if (user.role !== "ADMIN") {
    return err({
      type: "UNAUTHORIZED",
      message: "Only admins can update finalized projects.",
    } satisfies UnauthorizedError);
  }

  const projectResult = await getFinalizedProjectById(ctx, id);
  if (projectResult.isErr()) return err(projectResult.error);

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(id, {
      ...values,
      updatedAt: Date.now(),
    }),
    "Failed to patch finalized project",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const updateFinalizedProject = finalizedProjectMutation({
  args: {
    id: FinalizedProjectIdSchema,
    values: UpdateFinalizedProjectSchema,
  },
  handler: (ctx, args) =>
    serializeResult(_updateFinalizedProjectHandler(ctx, args)),
});

const _deleteFinalizedProjectHandler = async (
  ctx: MutationCtx,
  { id }: { id: FinalizedProjectId },
): Promise<Result<void, DeleteFinalizedProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  // Only admins can delete finalized projects
  if (user.role !== "ADMIN") {
    return err({
      type: "UNAUTHORIZED",
      message: "Only admins can delete finalized projects.",
    } satisfies UnauthorizedError);
  }

  const projectResult = await getFinalizedProjectById(ctx, id);
  if (projectResult.isErr()) return err(projectResult.error);

  const deleteResult = await fromPromiseUnexpectedError(
    ctx.db.delete(id),
    "Failed to delete finalized project",
  );
  if (deleteResult.isErr()) return err(deleteResult.error);

  return ok();
};

export const deleteFinalizedProject = finalizedProjectMutation({
  args: { id: FinalizedProjectIdSchema },
  handler: (ctx, args) =>
    serializeResult(_deleteFinalizedProjectHandler(ctx, args)),
});

const _addInterestedUserHandler = async (
  ctx: MutationCtx,
  { projectId }: z.infer<typeof ProjectTargetArgsSchema>,
): Promise<Result<void, AddInterestedUserError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const projectResult = await getFinalizedProjectById(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);
  const project = projectResult.value;

  const existingInterest = project.interestedUsers.find(
    (interestedUser) => interestedUser.userId === user._id,
  );
  if (existingInterest) return ok();

  const newInterestedUser = {
    createdAt: Date.now(),
    userId: user._id,
  };

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(project._id, {
      interestedUsers: [...project.interestedUsers, newInterestedUser],
      updatedAt: Date.now(),
    }),
    "Failed to add interested user to finalized project",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const addInterestedUser = finalizedProjectMutation({
  args: ProjectTargetArgsSchema,
  handler: (ctx, args) => serializeResult(_addInterestedUserHandler(ctx, args)),
});

const _removeInterestedUserHandler = async (
  ctx: MutationCtx,
  { projectId }: z.infer<typeof ProjectTargetArgsSchema>,
): Promise<Result<void, RemoveInterestedUserError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  const projectResult = await getFinalizedProjectById(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);
  const project = projectResult.value;

  const initialInterestedUsersCount = project.interestedUsers.length;
  const updatedInterestedUsers = project.interestedUsers.filter(
    (interestedUser) => interestedUser.userId !== user._id,
  );

  if (updatedInterestedUsers.length === initialInterestedUsersCount)
    return ok();

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(project._id, {
      interestedUsers: updatedInterestedUsers,
      updatedAt: Date.now(),
    }),
    "Failed to remove interested user from finalized project",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const removeInterestedUser = finalizedProjectMutation({
  args: ProjectTargetArgsSchema,
  handler: (ctx, args) =>
    serializeResult(_removeInterestedUserHandler(ctx, args)),
});

const _assignUserToProjectHandler = async (
  ctx: MutationCtx,
  { projectId, userId }: z.infer<typeof AssignUserSchema>,
): Promise<Result<void, AssignUserToProjectError>> => {
  const userResult = await getCurrentUser(ctx);
  if (userResult.isErr()) return err(userResult.error);
  const user = userResult.value;

  // Only admins can assign users to projects
  if (user.role !== "ADMIN") {
    return err({
      type: "UNAUTHORIZED",
      message: "Only admins can assign users to projects.",
    } satisfies UnauthorizedError);
  }

  const projectResult = await getFinalizedProjectById(ctx, projectId);
  if (projectResult.isErr()) return err(projectResult.error);
  const project = projectResult.value;

  // Check if user is already assigned to this project
  const existingAssignment = (project.assignedUsers || []).find(
    (assignedUser) => assignedUser.userId === userId,
  );
  if (existingAssignment) return ok();

  // Remove user from any other project they might be assigned to
  const allProjectsResult = await fromPromiseUnexpectedError(
    ctx.db
      .query("finalizedProjects")
      .withIndex("by_hackathon_event", (q) =>
        q.eq("hackathonEventId", project.hackathonEventId),
      )
      .collect(),
    "Failed to query finalized projects by hackathon event id",
  );
  if (allProjectsResult.isErr()) return err(allProjectsResult.error);

  // Remove user from all other projects
  const allProjects = allProjectsResult.value;
  for (const otherProject of allProjects) {
    if (otherProject._id === projectId) continue;

    const hasAssignment = (otherProject.assignedUsers || []).some(
      (assignedUser) => assignedUser.userId === userId,
    );

    if (hasAssignment) {
      const updatedAssignedUsers = (otherProject.assignedUsers || []).filter(
        (assignedUser) => assignedUser.userId !== userId,
      );

      const removeResult = await fromPromiseUnexpectedError(
        ctx.db.patch(otherProject._id, {
          assignedUsers: updatedAssignedUsers,
          updatedAt: Date.now(),
        }),
        "Failed to remove user from other project",
      );
      if (removeResult.isErr()) return err(removeResult.error);
    }
  }

  const newAssignedUser = {
    createdAt: Date.now(),
    userId: userId,
  };

  const patchResult = await fromPromiseUnexpectedError(
    ctx.db.patch(project._id, {
      assignedUsers: [...(project.assignedUsers || []), newAssignedUser],
      updatedAt: Date.now(),
    }),
    "Failed to assign user to finalized project",
  );
  if (patchResult.isErr()) return err(patchResult.error);

  return ok();
};

export const assignUserToProject = finalizedProjectMutation({
  args: AssignUserSchema,
  handler: (ctx, args) =>
    serializeResult(_assignUserToProjectHandler(ctx, args)),
});

// --- Queries ---
export const getFinalizedProjectsByHackathonEvent = finalizedProjectQuery({
  args: { hackathonEventId: HackathonEventIdSchema },
  handler: (ctx, { hackathonEventId }) =>
    serializeResult(
      modelGetFinalizedProjectsByHackathonEvent(ctx, hackathonEventId),
    ),
});

export const getAllUsers = finalizedProjectQuery({
  args: {},
  handler: (ctx) => serializeResult(modelGetAllUsers(ctx)),
});
