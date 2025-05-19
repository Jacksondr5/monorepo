"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-sm">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>Signed in</SignedIn>
    </main>
  );
}
