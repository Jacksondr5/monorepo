import "./global.css";
import { Providers } from "./providers";
import { Header } from "../components/Header";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getAuthToken } from "./auth";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Toaster } from "@j5/component-library";
import { PostHogIdentify } from "./posthog-identify";
import { SignedOutUI } from "~/components/SignedOutUI";
import { env } from "~/env";

// Force dynamic rendering because preloadQuery uses no-store fetch for real-time Convex data
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Welcome to hackathon",
  description: "This app is used to coordinate hackathons",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const tokenResult = await getAuthToken();
    const token = tokenResult.isOk() ? tokenResult.value : undefined;
    console.log("PRELOADING QUERY");
    console.log(env.NEXT_PUBLIC_CONVEX_URL);
    const latestHackathonPreloaded = await preloadQuery(
      api.hackathonEvents.getLatestHackathonEvent,
      {},
      { token },
    );

    return (
      <html lang="en">
        <body className="bg-slate-1 h-screen">
          <Providers authToken={token}>
            <Header preloadedLatestHackathon={latestHackathonPreloaded} />
            <SignedOut>
              <SignedOutUI />
            </SignedOut>
            <SignedIn>
              <PostHogIdentify />
              {children}
            </SignedIn>
            <Toaster />
          </Providers>
        </body>
      </html>
    );
  } catch (error) {
    console.error(error);
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}
