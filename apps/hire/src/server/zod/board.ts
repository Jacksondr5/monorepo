import { z } from "zod";
import { baseConvexFields } from "./utils";
import { CompanyIdSchema } from "./company";
import { KanbanStageIdSchema } from "./kanbanStage";

export const BoardSchema = z.object({
  ...baseConvexFields("boards"),
  companyId: CompanyIdSchema,
  kanbanStageIds: z.array(KanbanStageIdSchema),
  name: z.string().min(1),
  slug: z.string().min(1),
  order: z.number(),
});

export const CreateBoardSchema = z.object({
  name: z.string().min(1),
  orgId: z.string(),
});

export const UpdateBoardSchema = BoardSchema.omit({
  _creationTime: true,
  companyId: true,
  order: true,
}).extend({
  orgId: z.string(),
});

export const DeleteBoardSchema = z.object({
  boardId: BoardSchema.shape._id,
  orgId: z.string(),
});

export type ZodBoard = z.infer<typeof BoardSchema>;
