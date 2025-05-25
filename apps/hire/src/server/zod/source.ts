// --- Zod schema for source validation ---
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";
import { nonEmptyString } from "./utils";
import { CompanyIdSchema } from "./company";
import { baseConvexFields, baseConvexFieldsOmit } from "./utils";

export const SourceIdSchema = zid("sources");

export const SourceSchema = z.object({
  ...baseConvexFields("sources"),
  companyId: CompanyIdSchema,
  name: nonEmptyString,
  order: z.number(),
});

export const CreateSourceSchema = SourceSchema.omit(baseConvexFieldsOmit);

export type SourceId = z.infer<typeof SourceIdSchema>;
export type ZodSource = z.infer<typeof SourceSchema>;
export type ZodCreateSource = z.infer<typeof CreateSourceSchema>;
