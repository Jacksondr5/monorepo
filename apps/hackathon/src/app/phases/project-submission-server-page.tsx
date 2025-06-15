import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { ProjectSubmissionClientPage } from "./project-submission-client-page";
import type { HackathonEvent } from "~/server/zod";

interface ProjectSubmissionServerPageProps {
  hackathon: HackathonEvent;
  token: string;
}

export async function ProjectSubmissionServerPage({
  hackathon,
  token,
}: ProjectSubmissionServerPageProps) {
  // Preload data for project submission phase
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
  const projects = await preloadQuery(
    api.projects.getProjectsByHackathonEvent,
    { hackathonEventId: hackathon._id },
    { token },
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-slate-11 text-4xl font-bold">{hackathon.name}</h1>
        <p className="text-slate-11 text-lg">Project Submission Phase</p>
      </div>
      <ProjectSubmissionClientPage
        preloadedLatestHackathon={latestHackathonPreloaded}
        preloadedCurrentUser={currentUser}
        preloadedProjects={projects}
      />
    </main>
  );
}
