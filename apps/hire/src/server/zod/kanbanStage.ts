// --- Zod schema for kanbanStage validation ---
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";

export const KanbanStageIdSchema = zid("kanbanStages");

export const KanbanStageSchema = z.object({
  id: KanbanStageIdSchema,
  companyId: CompanyIdSchema,
  name: nonEmptyString,
  order: z.number(),
});

export const CreateKanbanStageSchema = KanbanStageSchema.omit({
  id: true,
});

export const UpdateKanbanStageSchema = KanbanStageSchema.omit({
  // Allow updating all except id
  id: true,
});

export type KanbanStageId = z.infer<typeof KanbanStageIdSchema>;
export type ZodKanbanStage = z.infer<typeof KanbanStageSchema>;
export type ZodCreateKanbanStage = z.infer<typeof CreateKanbanStageSchema>;
export type ZodUpdateKanbanStage = z.infer<typeof UpdateKanbanStageSchema>;
