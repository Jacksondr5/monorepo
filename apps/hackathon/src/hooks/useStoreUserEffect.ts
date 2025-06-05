import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ReactMutation, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CreateUserSchema, ZodCreateUser, ZodUserId } from "../server/zod/user";
import posthog from "posthog-js";
import { env } from "~/env";
import { captureException } from "@sentry/nextjs";
import { toast } from "@j5/component-library";
import { useRouter, usePathname } from "next/navigation";
import { err } from "neverthrow";
import {
  DataIsUnexpectedShapeError,
  serializeResult,
  UnexpectedError,
} from "../../convex/model/error";
import { processError } from "~/lib/errors";

const retryStoreUser = async (
  fn: ReactMutation<typeof api.users.upsertUser>,
  user: ZodCreateUser,
  times: number,
) => {
  const result = await fn({ user });
  if (result.ok) return result;
  if (times === 0) {
    return serializeResult(
      err({
        message: "Failed to store user.  Please try reloading the page.",
        type: "UNEXPECTED_ERROR",
        originalError: result.error,
      } satisfies UnexpectedError),
    );
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return retryStoreUser(fn, user, times - 1);
};

export function useStoreUserEffect() {
  const {
    user: clerkUser,
    isSignedIn: isClerkSignedIn,
    isLoaded: isClerkLoaded,
  } = useUser();
  const [convexUserId, setConvexUserId] = useState<ZodUserId | null>(null);
  const [isAuthenticationFinalized, setIsAuthenticationFinalized] =
    useState(false);
  const storeUser = useMutation(api.users.upsertUser);
  const router = useRouter();
  const pathname = usePathname();
  const [userUpsertSucceeded, setUserUpsertSucceeded] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    // If Clerk is not loaded yet don't do anything
    if (!isClerkLoaded) return;
    if (!isClerkSignedIn || !clerkUser) {
      setIsAuthenticationFinalized(true);
      return;
    }

    const userData = {
      clerkUserId: clerkUser.id,
      firstName: clerkUser.firstName!,
      lastName: clerkUser.lastName!,
      avatarUrl: clerkUser.imageUrl,
      role: "USER",
    } satisfies ZodCreateUser;
    async function createUser() {
      const parsedUser = CreateUserSchema.safeParse(userData);
      if (!parsedUser.success) {
        const error = JSON.stringify(parsedUser.error.format());
        processError(
          {
            type: "DATA_IS_UNEXPECTED_SHAPE",
            message: error,
          } satisfies DataIsUnexpectedShapeError,
          "Failed to store user",
        );
        setUserUpsertSucceeded(false);
        return;
      }
      const idResult = await retryStoreUser(storeUser, userData, 3);
      if (!idResult.ok) {
        captureException(idResult.error, { level: "fatal" });
        setUserUpsertSucceeded(false);
        toast({
          title: "Failed to store user.  Please try reloading the page.",
          description: idResult.error.message,
          variant: "error",
          action: {
            label: "Reload",
            onClick: () => {
              if (pathname === "/sign-up") {
                router.refresh();
              } else {
                router.push("/sign-up");
              }
            },
          },
        });
        return;
      }
      const id = idResult.value;
      setConvexUserId(id);
      posthog.identify(id, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatarUrl: userData.avatarUrl,
        role: userData.role,
        env: env.NEXT_PUBLIC_ENV,
      });
      setUserUpsertSucceeded(true);
      setIsAuthenticationFinalized(true);
    }
    createUser();
    return () => setConvexUserId(null);
  }, [isClerkSignedIn, storeUser, clerkUser, isClerkLoaded, pathname, router]);

  return {
    isLoading: !isAuthenticationFinalized,
    isAuthenticated: isClerkSignedIn && convexUserId !== null,
    userUpsertSucceeded,
  };
}
