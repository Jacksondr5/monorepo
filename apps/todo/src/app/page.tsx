"use client";

import { EditingProvider } from "~/contexts/EditingContext";
import { TaskList } from "~/components/TaskList";
import { TaskProvider } from "~/contexts/TaskContext";
import { HelpWrapper } from "~/components/help/HelpWrapper";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "@j5/component-library";

export default function Home() {
  return (
    <EditingProvider>
      <HelpWrapper>
        <main className="flex flex-col items-center justify-center">
          <SignedIn>
            <SignOutButton>
              <Button dataTestId="sign-out-button">Sign Out</Button>
            </SignOutButton>
            <TaskProvider>
              <TaskList />
            </TaskProvider>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button dataTestId="sign-in-button">Sign In</Button>
            </SignInButton>
            <div
              className="text-olive-12 mt-12 text-2xl"
              data-testid="signed-out-ui"
            >
              Sign in to start
            </div>
          </SignedOut>
        </main>
      </HelpWrapper>
    </EditingProvider>
  );
}
