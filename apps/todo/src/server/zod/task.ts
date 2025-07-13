import { z } from "zod";
import {
  baseConvexFields,
  baseConvexFieldsOmit,
  nonEmptyString,
} from "./utils";
import { zid } from "convex-helpers/server/zod";

export const TaskIdSchema = zid("tasks");

export const TaskSchema = z.object({
  ...baseConvexFields("tasks"),
  title: nonEmptyString,
  description: z.string().optional(),
  isBlocked: z.boolean().default(false),
  isDone: z.boolean().default(false),
  isImportant: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  createdById: z.string(),
  updatedAt: z.number(),
});

export const CreateTaskSchema = TaskSchema.omit({
  ...baseConvexFieldsOmit,
  isBlocked: true,
  isDone: true,
  createdById: true,
  updatedAt: true,
});

export const UpdateTaskSchema = TaskSchema.omit({
  ...baseConvexFieldsOmit,
  createdById: true,
})
  .partial()
  .extend({
    id: TaskIdSchema,
  });

// Individual update schemas for specific operations
export const SetTaskDescriptionSchema = z.object({
  id: TaskIdSchema,
  description: z.string().optional(),
});

export const SetTaskBlockedSchema = z.object({
  id: TaskIdSchema,
  isBlocked: z.boolean(),
});

export const SetTaskDoneSchema = z.object({
  id: TaskIdSchema,
  isDone: z.boolean(),
});

export const SetTaskImportantSchema = z.object({
  id: TaskIdSchema,
  isImportant: z.boolean().optional(),
});

export const SetTaskUrgentSchema = z.object({
  id: TaskIdSchema,
  isUrgent: z.boolean().optional(),
});

export const SetTaskTitleSchema = z.object({
  id: TaskIdSchema,
  title: nonEmptyString,
});

export const DeleteTaskSchema = z.object({
  id: TaskIdSchema,
});

// Type exports
export type ZodTaskId = z.infer<typeof TaskIdSchema>;
export type ZodTask = z.infer<typeof TaskSchema>;
export type ZodCreateTask = z.infer<typeof CreateTaskSchema>;
export type ZodUpdateTask = z.infer<typeof UpdateTaskSchema>;
export type ZodSetTaskDescription = z.infer<typeof SetTaskDescriptionSchema>;
export type ZodSetTaskBlocked = z.infer<typeof SetTaskBlockedSchema>;
export type ZodSetTaskDone = z.infer<typeof SetTaskDoneSchema>;
export type ZodSetTaskImportant = z.infer<typeof SetTaskImportantSchema>;
export type ZodSetTaskUrgent = z.infer<typeof SetTaskUrgentSchema>;
export type ZodSetTaskTitle = z.infer<typeof SetTaskTitleSchema>;
export type ZodDeleteTask = z.infer<typeof DeleteTaskSchema>;
