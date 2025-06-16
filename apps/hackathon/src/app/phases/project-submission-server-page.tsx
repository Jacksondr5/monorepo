import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { ProjectSubmissionClientPage } from "./project-submission-client-page";

interface ProjectSubmissionServerPageProps {
  token: string;
}

export async function ProjectSubmissionServerPage({
  token,
}: ProjectSubmissionServerPageProps) {
  const projectSubmissionData = await preloadQuery(
    api.projectSubmission.getProjectSubmissionData,
    {},
    { token },
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 md:p-8">
      <ProjectSubmissionClientPage
        preloadedProjectSubmissionData={projectSubmissionData}
      />
    </main>
  );
}
