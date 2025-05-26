import { BoardSchema } from "../board";
import { KanbanStageSchema } from "../kanbanStage";
import { z } from "zod";
import { CandidateSchema } from "../candidate";

export const BoardWithDataSchema = z.object({
  board: BoardSchema,
  stages: z.array(KanbanStageSchema),
  candidates: z.array(CandidateSchema),
});

export type BoardWithData = z.infer<typeof BoardWithDataSchema>;
