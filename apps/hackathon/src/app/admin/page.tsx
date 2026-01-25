import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import NoHackathon from "../no-hackathon";
import { getAuthToken } from "../auth";
import { AdminClientPage } from "./admin-client-page";
import { processError } from "~/lib/errors.server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const tokenResult = await getAuthToken();

  // If we can't get a token, redirect to sign-in
  if (tokenResult.isErr()) {
    if (tokenResult.error.type === "UNAUTHENTICATED") {
      redirect("/sign-in");
    } else {
      // Handle unexpected errors
      processError(tokenResult.error, "Failed to get authentication token");
      redirect("/sign-in");
    }
  }

  const token = tokenResult.value;

  const latestHackathonPreloaded = await preloadQuery(
    api.hackathonEvents.getLatestHackathonEvent,
    {},
    { token },
  );
  const latestHackathonResult = preloadedQueryResult(latestHackathonPreloaded);
  if (!latestHackathonResult.ok) {
    processError(latestHackathonResult.error, "Failed to get latest hackathon");
    return <NoHackathon />;
  }
  const latestHackathon = latestHackathonResult.value;

  const [currentUser, finalizedProjects] = await Promise.all([
    preloadQuery(api.users.getCurrentUser, {}, { token }),
    preloadQuery(
      api.finalizedProjects.getFinalizedProjectsByHackathonEvent,
      { hackathonEventId: latestHackathon._id },
      { token },
    ),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-slate-11 text-4xl font-bold">
          {latestHackathon.name} - Admin Panel
        </h1>
        <p className="text-slate-11 text-lg">
          Manage finalized projects for the hackathon
        </p>
      </div>
      <AdminClientPage
        preloadedLatestHackathon={latestHackathonPreloaded}
        preloadedCurrentUser={currentUser}
        preloadedFinalizedProjects={finalizedProjects}
      />
    </main>
  );
}
