import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { VotingClientPage } from "./voting-client-page";

interface ProjectVotingServerPageProps {
  token: string;
}

export async function ProjectVotingServerPage({
  token,
}: ProjectVotingServerPageProps) {
  const projectVotingData = await preloadQuery(
    api.projectVoting.getProjectVotingData,
    {},
    { token },
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <VotingClientPage preloadedProjectVotingData={projectVotingData} />
    </main>
  );
}
