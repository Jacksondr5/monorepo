import { z } from "zod";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

// Basic types
export type ConfigurationId = Id<"configuration">;
export type ZodConfiguration = z.infer<typeof ZodConfigurationSchema>;

// Convex document schema
export const ZodConfigurationSchema = z.object({
  _id: z.custom<ConfigurationId>(),
  _creationTime: z.number(),
  companyId: z.custom<Id<"companies">>(),
  onboardingOverviewKanbanStages: z.array(z.custom<Id<"kanbanStages">>()),
}) satisfies z.ZodSchema<Doc<"configuration">>;

// Input schemas for mutations
export const CreateConfigurationSchema = z.object({
  companyId: z.custom<Id<"companies">>(),
  onboardingOverviewKanbanStages: z
    .array(z.custom<Id<"kanbanStages">>())
    .default([]),
});

export const UpdateConfigurationSchema = z.object({
  onboardingOverviewKanbanStages: z.array(z.custom<Id<"kanbanStages">>()),
});

export type CreateConfiguration = z.infer<typeof CreateConfigurationSchema>;
export type UpdateConfiguration = z.infer<typeof UpdateConfigurationSchema>;
