import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import NoHackathon from "./no-hackathon";
import { getAuthToken } from "./auth";
import { processError } from "~/lib/errors";
import { redirect } from "next/navigation";
import { ProjectSubmissionServerPage } from "./phases/project-submission-server-page";
import { ProjectVotingServerPage } from "./phases/project-voting-server-page";
import { EventInProgressServerPage } from "./phases/event-in-progress-server-page";
import { EventEndedServerPage } from "./phases/event-ended-server-page";

export default async function HomePage() {
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

  switch (latestHackathon.currentPhase) {
    case "PROJECT_SUBMISSION":
      return <ProjectSubmissionServerPage token={token} />;
    case "PROJECT_VOTING":
      return <ProjectVotingServerPage token={token} />;
    case "EVENT_IN_PROGRESS":
      return <EventInProgressServerPage hackathon={latestHackathon} />;
    case "EVENT_ENDED":
      return <EventEndedServerPage hackathon={latestHackathon} />;
    default:
      // This ensures all phases are handled at compile time
      const exhaustiveCheck: never = latestHackathon.currentPhase;
      processError(
        {
          type: "UNEXPECTED_ERROR",
          message: `Unknown hackathon phase: ${exhaustiveCheck}`,
        },
        "Unknown hackathon phase encountered",
      );
      return <NoHackathon />;
  }
}
