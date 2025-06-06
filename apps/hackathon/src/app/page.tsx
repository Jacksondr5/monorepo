import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import NoHackathon from "./no-hackathon";
import { getAuthToken } from "./auth";
import { ClientPage } from "./client-page";
import { projectStatusMessages } from "../utils/messages";
import { processError } from "~/lib/errors";

export default async function HomePage() {
  const token = await getAuthToken();
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
  const currentUser = await preloadQuery(
    api.users.getCurrentUser,
    {},
    { token },
  );
  const projects = await preloadQuery(
    api.projects.getProjectsByHackathonEvent,
    { hackathonEventId: latestHackathon._id },
    { token },
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-slate-11 text-4xl font-bold">
          {latestHackathon.name}
        </h1>
        <p className="text-slate-11 text-lg">
          Current Phase: {projectStatusMessages[latestHackathon.currentPhase]}
        </p>
      </div>
      <ClientPage
        preloadedLatestHackathon={latestHackathonPreloaded}
        preloadedCurrentUser={currentUser}
        preloadedProjects={projects}
      />
    </main>
  );
}
