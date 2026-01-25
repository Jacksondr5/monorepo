import { J5BaseError, SerializableResult } from "../../convex/model/error";
import { captureException } from "@sentry/nextjs";

export const processError = (error: J5BaseError<string>, title: string) => {
  captureException(error);
  // Server-safe logging (no client toast)
  // Avoid leaking details in production logs; message is already captured by Sentry
  console.error(`[${title}]`, { type: error.type, message: error.message });
};

export const unwrapSerializableResult = <T, E extends J5BaseError<string>>(
  result: SerializableResult<T, E>,
  title: string,
) => {
  if (!result.ok) {
    processError(result.error, title);
    return undefined;
  }
  return result.value;
};
