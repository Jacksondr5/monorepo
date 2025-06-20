"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { env } from "~/env";

export function PostHogIdentify() {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const currentUserResult = useQuery(api.users.getCurrentUser, {});
  const posthog = usePostHog();

  useEffect(() => {
    // Only proceed if PostHog is enabled, user is loaded and signed in
    if (
      !env.NEXT_PUBLIC_POSTHOG_ENABLED ||
      !isLoaded ||
      !isSignedIn ||
      !clerkUser
    ) {
      return;
    }

    if (!currentUserResult || !currentUserResult.ok) {
      if (
        env.NEXT_PUBLIC_POSTHOG_DEBUG &&
        currentUserResult &&
        !currentUserResult.ok
      ) {
        console.warn(
          "PostHog identification skipped: user query failed",
          currentUserResult.error,
        );
      }
      return;
    }

    const convexUser = currentUserResult.value;

    posthog.identify(convexUser._id, {
      clerkUserId: clerkUser.id,
      role: convexUser.role,
      createdTime: convexUser._creationTime,
    });
  }, [isLoaded, isSignedIn, clerkUser, currentUserResult, posthog]);

  // This component doesn't render anything
  return null;
}
