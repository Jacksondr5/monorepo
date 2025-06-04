import { z } from "zod";
import { err, fromPromise, ok, Result, ResultAsync } from "neverthrow";

export type J5BaseError<T extends string> = {
  type: T;
  message: string;
};

export type UnexpectedError = J5BaseError<"UNEXPECTED_ERROR"> & {
  originalError: unknown;
};

export const isUnexpectedError = (
  error: J5BaseError<string>,
): error is UnexpectedError => {
  return error.type === "UNEXPECTED_ERROR";
};

export type NotFoundError<T extends string> = J5BaseError<`${T}_NOT_FOUND`> & {
  id: string;
};

export const getNotFoundError = <T extends string>(
  type: T,
  id: string,
): NotFoundError<T> => {
  return {
    type: `${type}_NOT_FOUND`,
    message: `${type.toLowerCase()} not found.`,
    id,
  };
};

export type NotUniqueError = J5BaseError<"NOT_UNIQUE"> & {
  // TODO: see if we can test the error Convex throws so we can remove this and use UnexpectedError
  originalError: unknown;
  uniqueConstraint: string;
};

export type UnauthenticatedError = J5BaseError<"UNAUTHENTICATED">;

export const unauthenticatedError = {
  type: "UNAUTHENTICATED",
  message: "User must be authenticated.",
} satisfies UnauthenticatedError;

export type UnauthorizedError = J5BaseError<"UNAUTHORIZED">;

export type DataIsUnexpectedShapeError =
  J5BaseError<"DATA_IS_UNEXPECTED_SHAPE">;

export const safeParseConvexObject = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown,
): Result<z.infer<typeof schema>, DataIsUnexpectedShapeError> => {
  const result = schema.safeParse(data);
  if (result.success) {
    return ok(result.data);
  }
  return err({
    type: "DATA_IS_UNEXPECTED_SHAPE",
    message: JSON.stringify(result.error.format()),
  });
};

export const safeParseConvexArray = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown,
): Result<z.infer<typeof schema>[], DataIsUnexpectedShapeError> => {
  const result = schema.array().safeParse(data);
  if (result.success) {
    return ok(result.data);
  }
  return err({
    type: "DATA_IS_UNEXPECTED_SHAPE",
    message: JSON.stringify(result.error.format()),
  });
};

export const fromPromiseUnexpectedError = <T>(
  promise: Promise<T>,
  messageSuffix?: string,
): ResultAsync<T, UnexpectedError> => {
  return fromPromise(promise, (originalError) => ({
    type: "UNEXPECTED_ERROR",
    message: `There was an unexpected error${messageSuffix ? ": " + messageSuffix : ""}.`,
    originalError,
  }));
};
