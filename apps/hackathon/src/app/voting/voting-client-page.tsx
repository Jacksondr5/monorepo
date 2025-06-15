"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMemo } from "react";
import { FinalizedProjectCard } from "~/components/finalized-projects/finalized-project-card";
import { unwrapSerializableResult } from "~/lib/errors";

export interface VotingClientPageProps {
  preloadedLatestHackathon: Preloaded<
    typeof api.hackathonEvents.getLatestHackathonEvent
  >;
  preloadedCurrentUser: Preloaded<typeof api.users.getCurrentUser>;
  preloadedFinalizedProjects: Preloaded<
    typeof api.finalizedProjects.getFinalizedProjectsByHackathonEvent
  >;
}

export const VotingClientPage = ({
  preloadedLatestHackathon,
  preloadedCurrentUser,
  preloadedFinalizedProjects,
}: VotingClientPageProps) => {
  const latestHackathonResult = usePreloadedQuery(preloadedLatestHackathon);
  const currentUserResult = usePreloadedQuery(preloadedCurrentUser);
  const finalizedProjectsResult = usePreloadedQuery(preloadedFinalizedProjects);

  // TODO: actually handle error
  const finalizedProjectsResultValue = unwrapSerializableResult(
    finalizedProjectsResult,
    "Failed to fetch finalized projects",
  );
  const latestHackathon = unwrapSerializableResult(
    latestHackathonResult,
    "Failed to fetch latest hackathon",
  );
  const currentUser = unwrapSerializableResult(
    currentUserResult,
    "Failed to fetch current user",
  );

  // Calculate current user's interests from the projects data
  const currentUserInterests = useMemo(() => {
    const interestedProjectIds = new Set<string>();
    finalizedProjectsResultValue?.projects.forEach((project) => {
      const isUserInterested = project.interestedUsers.some(
        (interestedUser) => interestedUser.userId === currentUser?._id,
      );
      if (isUserInterested) {
        interestedProjectIds.add(project._id);
      }
    });
    return interestedProjectIds;
  }, [finalizedProjectsResultValue, currentUser?._id]);

  if (!finalizedProjectsResultValue || !latestHackathon || !currentUser) {
    return null;
  }
  const { projects, visibleUsers: visibleUsersArray } =
    finalizedProjectsResultValue;

  const visibleUsers = new Map(
    visibleUsersArray.map((user) => [user._id, user]),
  );

  const hasProjects = projects.length > 0;
  const maxInterests = 3;

  const remainingInterests = maxInterests - currentUserInterests.size;

  return (
    <div className="w-full max-w-4xl">
      <div
        className={`mb-4 rounded-lg p-3 text-center text-sm font-medium ${
          remainingInterests > 0
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {remainingInterests > 0
          ? `You have ${remainingInterests} interest${remainingInterests === 1 ? "" : "s"} remaining`
          : "You have used all your interests"}
      </div>

      <div className="w-full">
        <h2 className="text-slate-12 mb-4 text-center text-3xl font-semibold">
          Finalized Projects
        </h2>
        <div className="flex flex-col">
          {!hasProjects && (
            <p className="text-slate-10 text-center">
              No finalized projects available yet for {latestHackathon.name}.
            </p>
          )}
          {hasProjects &&
            projects.map((project) => (
              <FinalizedProjectCard
                key={project._id}
                currentUser={currentUser}
                project={project}
                userMap={visibleUsers}
                remainingInterests={remainingInterests}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
