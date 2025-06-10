import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { type ZodUser } from "../server/zod/user";

export function useAuthStatus(): {
  isLoading: boolean;
  isAuthenticated: boolean;
  needsSignUp: boolean;
  isUnauthenticated: boolean;
  clerkUser: ReturnType<typeof useUser>["user"];
  convexUser: ZodUser | null;
} {
  const {
    user: clerkUser,
    isSignedIn: isClerkSignedIn,
    isLoaded: isClerkLoaded,
  } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser, {});

  // Authentication states
  const isLoading =
    !isClerkLoaded || (isClerkSignedIn && currentUser === undefined);
  const isAuthenticated = Boolean(isClerkSignedIn && currentUser?.ok === true);
  const needsSignUp = Boolean(isClerkSignedIn && currentUser?.ok === false);
  const isUnauthenticated = Boolean(isClerkLoaded && !isClerkSignedIn);

  return {
    isLoading,
    isAuthenticated,
    needsSignUp,
    isUnauthenticated,
    clerkUser,
    convexUser: currentUser?.ok ? currentUser.value : null,
  };
}
