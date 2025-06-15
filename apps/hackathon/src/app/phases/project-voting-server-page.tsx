import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { VotingClientPage } from "./voting-client-page";
import type { HackathonEvent } from "~/server/zod";

interface ProjectVotingServerPageProps {
  hackathon: HackathonEvent;
  token: string;
}

export async function ProjectVotingServerPage({
  hackathon,
  token,
}: ProjectVotingServerPageProps) {
  // Preload data for project voting phase
  const latestHackathonPreloaded = await preloadQuery(
    api.hackathonEvents.getLatestHackathonEvent,
    {},
    { token },
  );
  const currentUser = await preloadQuery(
    api.users.getCurrentUser,
    {},
    { token },
  );
  const finalizedProjects = await preloadQuery(
    api.finalizedProjects.getFinalizedProjectsByHackathonEvent,
    { hackathonEventId: hackathon._id },
    { token },
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-slate-11 text-4xl font-bold">{hackathon.name}</h1>
        <p className="text-slate-11 text-lg">
          Project Voting Phase - Select up to 3 projects you&apos;re interested
          in working on
        </p>
      </div>
      <VotingClientPage
        preloadedLatestHackathon={latestHackathonPreloaded}
        preloadedCurrentUser={currentUser}
        preloadedFinalizedProjects={finalizedProjects}
      />
    </main>
  );
}
