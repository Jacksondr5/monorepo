import { auth } from "@clerk/nextjs/server";
import { err, ok, Result } from "neverthrow";

export type AuthTokenError =
  | { type: "UNAUTHENTICATED"; message: string }
  | { type: "UNEXPECTED_ERROR"; message: string; originalError: unknown };

export async function getAuthToken(): Promise<Result<string, AuthTokenError>> {
  try {
    const authResult = await auth();

    // If no user is authenticated, return unauthenticated error
    if (!authResult.userId) {
      return err({
        type: "UNAUTHENTICATED",
        message: "User must be authenticated to get auth token.",
      });
    }

    const token = await authResult.getToken({ template: "convex" });

    // If token is null, this is unexpected since user is authenticated
    if (!token) {
      return err({
        type: "UNEXPECTED_ERROR",
        message: "Failed to get auth token despite user being authenticated.",
        originalError: new Error("Token was null"),
      });
    }

    return ok(token);
  } catch (originalError) {
    return err({
      type: "UNEXPECTED_ERROR",
      message: "There was an unexpected error while getting auth token.",
      originalError,
    });
  }
}
