"use client";

import { TooltipProvider } from "@j5/component-library";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { env } from "~/env";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexProvider client={convex}>
      <TooltipProvider>{children}</TooltipProvider>
    </ConvexProvider>
  );
};
