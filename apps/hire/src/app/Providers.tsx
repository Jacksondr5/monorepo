"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { env } from "../env";
import { useAuth } from "@clerk/nextjs";
import { SidebarProvider } from "@j5/component-library";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <SidebarProvider>{children}</SidebarProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
