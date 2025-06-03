import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ReactMutation, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ZodCreateUser, ZodUserId } from "../server/zod/user";
import posthog from "posthog-js";
import { env } from "~/env";

const retryStoreUser = async (
  fn: ReactMutation<typeof api.users.upsertUser>,
  user: ZodCreateUser,
  times: number,
) => {
  try {
    return fn({ user });
  } catch (error) {
    if (times === 0) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return retryStoreUser(fn, user, times - 1);
  }
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
      try {
        const id = await retryStoreUser(storeUser, userData, 3);
        setConvexUserId(id);
        posthog.identify(id, {
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatarUrl: userData.avatarUrl,
          role: userData.role,
          env: env.NEXT_PUBLIC_ENV,
        });
        setIsAuthenticationFinalized(true);
      } catch (error) {
        console.error("Failed to store user:", error);
        // TODO: add toast
      }
    }
    createUser();
    return () => setConvexUserId(null);
  }, [isClerkSignedIn, storeUser, clerkUser?.id, isClerkLoaded]);

  return {
    isLoading: !isAuthenticationFinalized,
    isAuthenticated: isClerkSignedIn && convexUserId !== null,
  };
}
