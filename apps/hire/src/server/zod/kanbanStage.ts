// --- Zod schema for kanbanStage validation ---
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";
import { baseConvexFields } from "./utils";

export const KanbanStageIdSchema = zid("kanbanStages");

export const KanbanStageSchema = z.object({
  ...baseConvexFields("kanbanStages"),
  companyId: CompanyIdSchema,
  name: nonEmptyString,
  order: z.number(),
});

export const CreateKanbanStageSchema = KanbanStageSchema.omit({
  _id: true,
  _creationTime: true,
});

export type KanbanStageId = z.infer<typeof KanbanStageIdSchema>;
export type ZodKanbanStage = z.infer<typeof KanbanStageSchema>;
export type ZodCreateKanbanStage = z.infer<typeof CreateKanbanStageSchema>;
