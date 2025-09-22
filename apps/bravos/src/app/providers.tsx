"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { env } from "~/env";
import { ConvexReactClient } from "convex/react";
import { useMemo } from "react";

const client = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export const Providers = ({
  children,
  authToken,
}: {
  children: React.ReactNode;
  authToken?: string;
}) => {
  // Convex client setup
  const convex = useMemo(() => {
    if (authToken) {
      client.setAuth(async () => authToken);
    }
    return client;
  }, [authToken]);
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
