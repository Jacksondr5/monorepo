"use client";

import { UserButton, SignInButton } from "@clerk/nextjs";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@j5/component-library";
import { useAuthStatus } from "~/hooks/useAuthStatus";
import { Skeleton } from "@j5/component-library";
import { HackathonInfoView } from "./HackathonInfo";
import { Doc } from "../../convex/_generated/dataModel";

export interface HeaderViewProps {
  hackathonEvent?: Doc<"hackathonEvents">;
  hackathonError?: {
    type: string;
    message: string;
  };
  isAuthLoading: boolean;
  isAuthenticated: boolean;
}

export function HeaderView({
  hackathonEvent,
  hackathonError,
  isAuthLoading,
  isAuthenticated,
}: HeaderViewProps) {
  return (
    <header className="bg-slate-2 border-slate-3 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {hackathonEvent || hackathonError ? (
          <HackathonInfoView
            hackathonEvent={hackathonEvent}
            error={hackathonError}
          />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-slate-12 text-lg font-semibold">
              Hackathon Platform
            </span>
          </div>
        )}
        <div>
          {isAuthLoading ? (
            <Skeleton className="h-10 w-20 rounded-md" />
          ) : isAuthenticated ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal" signUpForceRedirectUrl="/sign-up">
              <Button variant="default" dataTestId="header-sign-in-button">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}

export interface HeaderProps {
  preloadedLatestHackathon: Preloaded<
    typeof api.hackathonEvents.getLatestHackathonEvent
  >;
}

export function Header({ preloadedLatestHackathon }: HeaderProps) {
  const { isAuthenticated, isLoading } = useAuthStatus();

  const latestHackathon = usePreloadedQuery(preloadedLatestHackathon);

  return (
    <HeaderView
      hackathonEvent={latestHackathon.ok ? latestHackathon.value : undefined}
      hackathonError={latestHackathon.ok ? undefined : latestHackathon.error}
      isAuthLoading={isLoading}
      isAuthenticated={isAuthenticated}
    />
  );
}
