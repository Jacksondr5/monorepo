import { EditingProvider } from "~/contexts/EditingContext";
import { TaskList } from "~/components/TaskList";
import { auth } from "@clerk/nextjs/server";
import { HydrateClient, api } from "~/trpc/server";
import { TaskProvider } from "~/contexts/TaskContext";
import { HelpWrapper } from "~/components/help/HelpWrapper";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  SignOutButton,
} from "@clerk/nextjs";

function SignInOutButton({ type }: { type: "signin" | "signout" }) {
  return (
    <button className="absolute top-4 right-4 rounded-full bg-grass-9 px-6 py-2 font-semibold no-underline transition hover:bg-grass-10">
      {type === "signin" ? "Sign in" : "Sign out"}
    </button>
  );
}

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    void api.todo.get.prefetch();
  }

  return (
    <HydrateClient>
      <EditingProvider>
        <HelpWrapper>
          <main className="flex flex-col items-center justify-center">
            <SignedIn>
              <SignOutButton>
                <SignInOutButton type="signout" />
              </SignOutButton>
              <TaskProvider>
                <TaskList />
              </TaskProvider>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <SignInOutButton type="signin" />
              </SignInButton>
              <div className="mt-12 text-2xl text-olive-12">
                Sign in to start
              </div>
            </SignedOut>
          </main>
        </HelpWrapper>
      </EditingProvider>
    </HydrateClient>
  );
}
