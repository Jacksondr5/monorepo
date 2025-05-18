"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  const sources = useQuery(api.sources.getSources);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-sm">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>Signed in</SignedIn>
      {sources?.map(({ _id, name }) => <div key={_id}>{name}</div>)}
    </main>
  );
}
