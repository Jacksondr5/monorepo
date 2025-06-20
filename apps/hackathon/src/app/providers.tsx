"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { env } from "../env";
import { TooltipProvider } from "@j5/component-library";
import { useMemo, useEffect, Suspense } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";

export interface ProvidersProps {
  children: React.ReactNode;
  authToken?: string;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (pathname && ph && ph.__loaded) {
      let url = window.origin + pathname;
      const search = searchParams.toString();
      if (search) {
        url += "?" + search;
      }
      ph.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}

export const Providers = ({ children, authToken }: ProvidersProps) => {
  // Convex client setup
  const convex = useMemo(() => {
    const client = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
    if (authToken) {
      client.setAuth(async () => authToken);
    }
    return client;
  }, [authToken]);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      <ClerkProvider>
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
          <TooltipProvider>{children}</TooltipProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </PHProvider>
  );
};
