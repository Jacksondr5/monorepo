import { toast } from "@j5/component-library";
import { J5BaseError, SerializableResult } from "../../convex/model/error";
import { captureException } from "@sentry/nextjs";

export const processError = (error: J5BaseError<string>, title: string) => {
  captureException(error);
  toast({
    description: error.message,
    title,
    variant: "error",
  });
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
