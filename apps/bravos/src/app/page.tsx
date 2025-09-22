"use client";

import {
  SignedOut,
  SignInButton,
  SignedIn,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "@j5/component-library";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <SignedIn>
        <SignOutButton>
          <Button dataTestId="sign-out-button">Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button dataTestId="sign-in-button">Sign In</Button>
        </SignInButton>
        <div className="text-olive-12 mt-12 text-2xl">Sign in to start</div>
      </SignedOut>
    </main>
  );
}
