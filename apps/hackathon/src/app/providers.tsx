"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { env } from "../env";
import { TooltipProvider } from "@j5/component-library";

export interface ProvidersProps {
  children: React.ReactNode;
  authToken?: string;
}

export const Providers = ({ children, authToken }: ProvidersProps) => {
  const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
  if (authToken) {
    convex.setAuth(async () => authToken);
  }
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <TooltipProvider>{children}</TooltipProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
