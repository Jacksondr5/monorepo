import { zid } from "convex-helpers/server/zod";
import { z } from "zod";
import { TableNames } from "../../../convex/_generated/dataModel";

export const nonEmptyString = z.string().min(1);

export const baseConvexFields = <T extends TableNames>(tableName: T) => ({
  _id: zid(tableName),
  _creationTime: z.number(),
});

export const baseConvexFieldsOmit = {
  _id: true as const,
  _creationTime: true as const,
};
