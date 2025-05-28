"use client";

import { UserButton, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button, Skeleton } from "@j5/component-library";
import { useStoreUserEffect } from "~/hooks/useStoreUserEffect";

export function Header() {
  const { isLoading, isAuthenticated } = useStoreUserEffect();
  const latestHackathon = useQuery(
    api.hackathonEvents.getLatestHackathonEvent,
    {},
  );
  // TODO: make this server side render so we don't get the UI change
  return (
    <header className="bg-slate-2 border-slate-3 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <span className="text-slate-12 text-lg font-semibold">
          {latestHackathon === undefined && (
            <Skeleton className="h-6 w-48 rounded" />
          )}
          {latestHackathon === null && "No hackathon event"}
          {latestHackathon && latestHackathon.name}
        </span>
        <div>
          {isAuthenticated ? (
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
