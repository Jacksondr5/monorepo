import "./global.css";
import { Providers } from "./providers";
import { Header } from "../components/Header";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getAuthToken } from "./auth";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export const metadata = {
  title: "Welcome to hackathon",
  description: "This app is used to coordinate hackathons",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthToken();
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
            <div className="text-slate-11 mt-8 w-full text-center text-3xl">
              You need to sign in to view this app
            </div>
          </SignedOut>
          <SignedIn>{children}</SignedIn>
        </Providers>
      </body>
    </html>
  );
}
