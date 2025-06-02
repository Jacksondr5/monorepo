"use client";

import { UserButton, SignInButton } from "@clerk/nextjs";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@j5/component-library";
import { useStoreUserEffect } from "~/hooks/useStoreUserEffect";
import { Skeleton } from "@j5/component-library";
import { projectStatusMessages } from "~/utils/messages";

export interface HeaderProps {
  preloadedLatestHackathon: Preloaded<
    typeof api.hackathonEvents.getLatestHackathonEvent
  >;
}

export function Header({ preloadedLatestHackathon }: HeaderProps) {
  const { isAuthenticated, isLoading } = useStoreUserEffect();
  const latestHackathon = usePreloadedQuery(preloadedLatestHackathon);
  return (
    <header className="bg-slate-2 border-slate-3 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-baseline gap-2">
          <span className="text-slate-12 text-lg font-semibold">
            {latestHackathon === null
              ? "No hackathon event"
              : latestHackathon.name}
          </span>
          {latestHackathon && <span className="text-slate-11 text-lg">|</span>}
          {latestHackathon && (
            <p className="text-slate-11 text-sm">
              {projectStatusMessages[latestHackathon.currentPhase]}
            </p>
          )}
        </div>
        <div>
          {isLoading ? (
            <Skeleton className="h-10 w-20 rounded-md" />
          ) : isAuthenticated ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <Button variant="default">Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
